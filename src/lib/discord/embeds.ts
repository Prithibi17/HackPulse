import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { format } from 'date-fns';

export function formatPrizeAmount(prizePool?: number | null, currency: string = 'INR'): string {
  if (prizePool === null || prizePool === undefined) {
    return 'Prize pool not announced';
  }
  if (prizePool === 0) return 'Free / Non-monetary rewards';
  if (currency === 'INR') {
    return `₹${prizePool.toLocaleString('en-IN')}`;
  }
  return `$${prizePool.toLocaleString('en-US')}`;
}

export function formatDisplayDate(date?: Date | string | null): string {
  if (!date) return 'Date verification required';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Date verification required';
  return format(d, 'd MMMM yyyy');
}

export function formatLocation(hackathon: {
  mode: string;
  venueName?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}): string {
  if (hackathon.mode === 'ONLINE') {
    return '🌐 Online';
  }
  const parts = [hackathon.venueName, hackathon.city, hackathon.state, hackathon.country].filter(Boolean);
  if (parts.length === 0) return 'Location not confirmed';
  return `📍 ${parts.join(', ')}`;
}

export function createHackathonEmbed(hackathon: any, appUrl: string = 'http://localhost:3000') {
  const isClosing = hackathon.registrationStatus === 'CLOSING_SOON';
  const color =
    hackathon.isPostponed
      ? 0xf59e0b // Amber
      : isClosing
      ? 0xef4444 // Red
      : hackathon.mode === 'ONLINE'
      ? 0x3b82f6 // Blue
      : 0x10b981; // Green

  let themesList = 'General';
  try {
    const parsedThemes = typeof hackathon.themes === 'string' ? JSON.parse(hackathon.themes) : hackathon.themes;
    if (Array.isArray(parsedThemes) && parsedThemes.length > 0) {
      themesList = parsedThemes.join(' • ');
    }
  } catch {}

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`🚀 NEW HACKATHON: ${hackathon.name}`)
    .setURL(`${appUrl}/hackathons/${hackathon.slug}`)
    .setDescription(
      hackathon.description?.slice(0, 200) + (hackathon.description?.length > 200 ? '...' : '')
    )
    .addFields(
      { name: 'Organized by', value: hackathon.organizerName || 'Independent Organizer', inline: true },
      { name: 'Format', value: `🏢 ${hackathon.mode}`, inline: true },
      { name: 'Location', value: formatLocation(hackathon), inline: false },
      { name: '🏆 Prize Pool', value: formatPrizeAmount(hackathon.prizePool, hackathon.prizeCurrency), inline: true },
      { name: '👥 Team Size', value: `${hackathon.teamMin}–${hackathon.teamMax} members`, inline: true },
      { name: '🎓 Eligibility', value: hackathon.eligibility || 'Open to all', inline: true },
      { name: '🎯 Tracks & Themes', value: themesList, inline: false },
      {
        name: '📅 Event Dates',
        value: `${formatDisplayDate(hackathon.eventStartDate)} – ${formatDisplayDate(hackathon.eventEndDate)}`,
        inline: true,
      },
      {
        name: '⏰ Registration Deadline',
        value: `${formatDisplayDate(hackathon.registrationDeadline)} (${hackathon.registrationStatus.replace('_', ' ')})`,
        inline: true,
      }
    )
    .setFooter({
      text: `HackPulse • Source: ${hackathon.sourceName} • Verification: ${hackathon.verificationStatus || 'VERIFIED'}`,
    })
    .setTimestamp();

  if (hackathon.bannerImage) {
    embed.setImage(hackathon.bannerImage);
  }

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel('Register Now')
      .setStyle(ButtonStyle.Link)
      .setURL(hackathon.registrationUrl || `${appUrl}/hackathons/${hackathon.slug}`),
    new ButtonBuilder()
      .setLabel('View on HackPulse')
      .setStyle(ButtonStyle.Link)
      .setURL(`${appUrl}/hackathons/${hackathon.slug}`),
    new ButtonBuilder()
      .setCustomId(`btn_save_${hackathon.id}`)
      .setLabel('Save')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('🔖'),
    new ButtonBuilder()
      .setCustomId(`btn_remind_${hackathon.id}`)
      .setLabel('Remind Me')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('⏰'),
    new ButtonBuilder()
      .setCustomId(`btn_team_${hackathon.id}`)
      .setLabel('Find Team')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('👥')
  );

  return { embeds: [embed], components: [buttons] };
}

export function createClosingSoonEmbed(hackathon: any, appUrl: string = 'http://localhost:3000') {
  const embed = new EmbedBuilder()
    .setColor(0xef4444)
    .setTitle(`⏰ REGISTRATION CLOSING SOON: ${hackathon.name}`)
    .setURL(`${appUrl}/hackathons/${hackathon.slug}`)
    .setDescription(`Registration for **${hackathon.name}** closes soon! Submit your applications before the deadline.`)
    .addFields(
      { name: '📍 Location', value: formatLocation(hackathon), inline: true },
      { name: '🏆 Prize Pool', value: formatPrizeAmount(hackathon.prizePool, hackathon.prizeCurrency), inline: true },
      { name: '👥 Team Size', value: `${hackathon.teamMin}–${hackathon.teamMax}`, inline: true },
      { name: '⏰ Deadline', value: formatDisplayDate(hackathon.registrationDeadline), inline: false }
    )
    .setFooter({ text: 'HackPulse Urgent Alert Engine' })
    .setTimestamp();

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel('Register Now')
      .setStyle(ButtonStyle.Link)
      .setURL(hackathon.registrationUrl || `${appUrl}/hackathons/${hackathon.slug}`),
    new ButtonBuilder()
      .setLabel('View Details')
      .setStyle(ButtonStyle.Link)
      .setURL(`${appUrl}/hackathons/${hackathon.slug}`)
  );

  return { embeds: [embed], components: [buttons] };
}

export function createPostponedEmbed(
  hackathon: any,
  oldDateStr: string,
  newDateStr: string,
  appUrl: string = 'http://localhost:3000'
) {
  const embed = new EmbedBuilder()
    .setColor(0xf59e0b)
    .setTitle(`📢 EVENT POSTPONED: ${hackathon.name}`)
    .setURL(`${appUrl}/hackathons/${hackathon.slug}`)
    .setDescription(`**${hackathon.name}** has officially announced new event dates.`)
    .addFields(
      { name: 'Previous Date', value: oldDateStr || 'TBD', inline: true },
      { name: 'New Date', value: newDateStr || formatDisplayDate(hackathon.eventStartDate), inline: true },
      { name: 'Location', value: formatLocation(hackathon), inline: false }
    )
    .setFooter({ text: 'HackPulse Change Detection' })
    .setTimestamp();

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel('View Event Details')
      .setStyle(ButtonStyle.Link)
      .setURL(`${appUrl}/hackathons/${hackathon.slug}`)
  );

  return { embeds: [embed], components: [buttons] };
}

export function createRegistrationOpenEmbed(hackathon: any, appUrl: string = 'http://localhost:3000') {
  const embed = new EmbedBuilder()
    .setColor(0x10b981)
    .setTitle(`🔥 REGISTRATION NOW OPEN: ${hackathon.name}`)
    .setURL(`${appUrl}/hackathons/${hackathon.slug}`)
    .setDescription(`Applications for **${hackathon.name}** have officially opened!`)
    .addFields(
      { name: 'Organizer', value: hackathon.organizerName, inline: true },
      { name: 'Format', value: hackathon.mode, inline: true },
      { name: 'Deadline', value: formatDisplayDate(hackathon.registrationDeadline), inline: true }
    )
    .setFooter({ text: 'HackPulse Instant Alert' })
    .setTimestamp();

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel('Register Now')
      .setStyle(ButtonStyle.Link)
      .setURL(hackathon.registrationUrl || `${appUrl}/hackathons/${hackathon.slug}`),
    new ButtonBuilder()
      .setLabel('View on HackPulse')
      .setStyle(ButtonStyle.Link)
      .setURL(`${appUrl}/hackathons/${hackathon.slug}`)
  );

  return { embeds: [embed], components: [buttons] };
}

export function createUpdateEmbed(
  hackathon: any,
  changes: { field: string; previousValue: string | null; newValue: string | null }[],
  appUrl: string = 'http://localhost:3000'
) {
  const embed = new EmbedBuilder()
    .setColor(0x3b82f6)
    .setTitle(`📝 EVENT UPDATE: ${hackathon.name}`)
    .setURL(`${appUrl}/hackathons/${hackathon.slug}`)
    .setDescription(`Updates have been detected for **${hackathon.name}**.`)
    .setFooter({ text: 'HackPulse Change Tracker' })
    .setTimestamp();

  for (const c of changes) {
    let fieldTitle = c.field;
    if (c.field === 'registrationDeadline') fieldTitle = '⏰ Registration Deadline Extended';
    else if (c.field === 'prizePool') fieldTitle = '🏆 Prize Pool Updated';
    else if (c.field === 'venueName') fieldTitle = '📍 Venue Announced';

    embed.addFields({
      name: fieldTitle,
      value: `Previously: ${c.previousValue || 'Unspecified'} ➔ **${c.newValue || 'Updated'}**`,
      inline: false,
    });
  }

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel('View Updated Event')
      .setStyle(ButtonStyle.Link)
      .setURL(`${appUrl}/hackathons/${hackathon.slug}`)
  );

  return { embeds: [embed], components: [buttons] };
}
