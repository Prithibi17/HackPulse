# HackRadar — 60-Source Crawler & 5-Hour Autonomous Engine

HackRadar continuously and autonomously discovers hackathons across **60 distinct platforms, institutes, and developer ecosystems** on a fixed 5-hour cron schedule (`00:00`, `05:00`, `10:00`, `15:00`, `20:00` in `Asia/Kolkata` timezone).

---

## 1. 60-Source Directory Breakdown

### A. Aggregators & Major Platforms (10 Sources)
1. **Devfolio** (`https://devfolio.co`)
2. **Unstop** (`https://unstop.com`)
3. **Devpost** (`https://devpost.com`)
4. **Major League Hacking (MLH)** (`https://mlh.io`)
5. **HackerEarth Competitions** (`https://www.hackerearth.com/challenges/hackathon/`)
6. **Kaggle Community Competitions** (`https://www.kaggle.com/competitions`)
7. **Taikai Web3 Hackathons** (`https://taikai.network/hackathons`)
8. **DoraHacks Global** (`https://dorahacks.io/hackathon`)
9. **Gitcoin Hackathons** (`https://gitcoin.co/hackathons`)
10. **Eventbrite Tech Hackathons** (`https://www.eventbrite.com/d/online/hackathon/`)

### B. Premier Technical Institutes / IITs / NITs / BITS (25 Sources)
11. **IIT Bombay Techfest** (`https://techfest.org`)
12. **IIT Delhi Tryst & HackDTU** (`https://tryst-iitd.org`)
13. **IIT Madras Shaastra** (`https://shaastra.org`)
14. **IIT Kharagpur Kshitij** (`https://ktj.in`)
15. **IIT Roorkee Cognizance** (`https://cognizance.org.in`)
16. **IIT Jodhpur Innovation Hub** (`https://iitj.ac.in/innovation`)
17. **IIT Kanpur Techkriti** (`https://techkriti.org`)
18. **IIT (BHU) Varanasi Technex** (`https://technex.co.in`)
19. **IIT Guwahati Techniche** (`https://techniche.org`)
20. **IIT Hyderabad Elan & ηVision** (`https://elan.org.in`)
21. **BITS Pilani APOGEE** (`https://bits-apogee.org`)
22. **BITS Goa Quark** (`https://bits-quark.org`)
23. **BITS Hyderabad ATMOS** (`https://bits-atmos.org`)
24. **NIT Trichy Pragyan** (`https://pragyan.org`)
25. **NIT Surathkal Engineer** (`https://incident.co.in`)
26. **NIT Warangal Technozion** (`https://technozion.org`)
27. **IIIT Hyderabad Felicity & HackIIIT** (`https://felicity.iiit.ac.in`)
28. **IIIT Bangalore Tech Society** (`https://iiitb.ac.in/events`)
29. **IIIT Delhi Esya & Byld** (`https://esya.iiitd.edu.in`)
30. **Delhi Technological University (DTU Invictus)** (`https://invictus.dtu.ac.in`)
31. **NSUT Delhi HackNSUT** (`https://hacknsut.com`)
32. **Manipal MIT TechTatva** (`https://techtatva.manipal.edu`)
33. **VIT Vellore HackVIT & Riviera** (`https://vit.ac.in/hackvit`)
34. **SRM University HackSRM** (`https://hacksrm.tech`)
35. **Thapar Institute HackThapar** (`https://hackthapar.com`)

### C. Regional & State University Campus Hubs (15 Sources)
36. **MNIT Jaipur Sphinx & HackMNIT** (`https://mnit.ac.in/sphinx`)
37. **LNMIIT Jaipur Plinth** (`https://plinth.lnmiit.ac.in`)
38. **Rajasthan Technical University (RTU Kota)** (`https://rtu.ac.in/events`)
39. **Smart City Udaipur Civic Tech** (`https://udaipursmartcity.gov.in`)
40. **JIET Jodhpur Hackathon Portal** (`https://jietjodhpur.ac.in/hack`)
41. **University of Rajasthan Tech Portal (Jaipur)** (`https://uniraj.ac.in/events`)
42. **RV College of Engineering (8th Mile Hack, Bangalore)** (`https://rvce.edu.in/hackathons`)
43. **PES University Hackerspace (Bangalore)** (`https://pes.edu/hackerspace`)
44. **BMS College PhaseShift (Bangalore)** (`https://bmscephaseshift.com`)
45. **COEP Technological University MindSpark (Pune)** (`https://mind-spark.org`)
46. **VJTI Mumbai Technovanza** (`https://technovanza.org`)
47. **SPIT Mumbai Oculus Hack** (`https://oculus.spit.ac.in`)
48. **Anna University Kurukshetra (Chennai)** (`https://kurukshetra.org.in`)
49. **PSG College of Tech Kriya (Coimbatore)** (`https://psgkriya.in`)
50. **Jadavpur University Srijan (Kolkata)** (`https://srijanju.in`)

### D. Global & Ecosystem Foundation Feeds (10 Sources)
51. **ETHGlobal Decentralized Hackathons** (`https://ethglobal.com/events`)
52. **Solana Foundation Hackathons** (`https://solana.com/hackathon`)
53. **Polygon DevX Global Tour** (`https://polygon.technology/devx`)
54. **Google Developer Groups & GDSC India** (`https://developers.google.com/community/gdsc`)
55. **Microsoft Imagine Cup Global** (`https://imaginecup.microsoft.com`)
56. **AWS Community Builders Hackathons** (`https://aws.amazon.com/developer/community/`)
57. **Chainlink Global Smart Contract Hackathons** (`https://chain.link/hackathon`)
58. **NASA Space Apps Challenge (India Hubs)** (`https://www.spaceappschallenge.org`)
59. **Polkadot & Web3 Foundation Sprints** (`https://polkadot.network/community/events/`)
60. **Open Source Initiative (OSI) Sprints** (`https://opensource.org/events`)

---

## 2. 5-Hour Autonomous Scheduling Mechanism

- Fixed cron slots: `00:00`, `05:00`, `10:00`, `15:00`, `20:00` (`Asia/Kolkata`).
- Survives application & server restarts without resetting timing or causing time drift.
- Deduplication against database guarantees that already-posted hackathons are never reposted as duplicates.
- Change detection flags meaningful modifications (deadline extensions, venue announcements, postponements) and dispatches update alerts to subscribed Discord servers.
