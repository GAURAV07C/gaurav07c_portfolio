const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.openSource.deleteMany();
  await prisma.repository.deleteMany();
  await prisma.organisation.deleteMany();
  console.log("Cleared all OpenSource related data");

  const org = await prisma.organisation.create({
    data: {
      name: "Cal.com",
      slug: "calcom",
      description: "Cal.com is the open-source Calendly alternative.",
      image: "/images/orgs/calcom.png",
    },
  });

  const repo = await prisma.repository.create({
    data: {
      organisationId: org.id,
      name: "cal.diy",
      slug: "cal-diy",
      url: "https://github.com/calcom/cal.diy",
      description: "Cal.com main repository",
      image: "/images/repos/cal-diy.png",
    },
  });

  const contributions = [
    {
      title: "fix(emails): send METHOD:CANCEL in ICS for cancelled bookings",
      repoId: repo.id,
      description:
        "Fixed ICS calendar invites to correctly include METHOD:CANCEL when bookings are cancelled, ensuring proper calendar sync behavior across email clients.",
      prUrl: "https://github.com/calcom/cal.diy/pull/29708",
      type: "bug-fix",
      techStack: JSON.stringify(["TypeScript", "React", "Node.js"]),
      date: "Jul 2026",
      status: "merged",
      slug: "fix-emails-method-cancel-ics-cancelled-bookings",
      image: null,
    },
    {
      title: "fix(i18n): add missing space between number and unit in Hebrew duration",
      repoId: repo.id,
      description:
        "Fixed Hebrew localization formatting by adding the missing space between numbers and duration units, improving text readability and consistency in the i18n system.",
      prUrl: "https://github.com/calcom/cal.diy/pull/29695",
      type: "bug-fix",
      techStack: JSON.stringify(["TypeScript", "i18n", "React"]),
      date: "Jul 2026",
      status: "merged",
      slug: "fix-i18n-hebrew-duration-space",
      image: null,
    },
    {
      title: "fix(ui): render markdown headings properly in event descriptions",
      repoId: repo.id,
      description:
        "Improved markdown rendering in event description fields to correctly display headings, enhancing the overall UI consistency and readability for event pages.",
      prUrl: "https://github.com/calcom/cal.diy/pull/29648",
      type: "bug-fix",
      techStack: JSON.stringify(["TypeScript", "React", "Markdown"]),
      date: "Jul 2026",
      status: "merged",
      slug: "fix-ui-markdown-headings-event-descriptions",
      image: null,
    },
    {
      title: "fix(bookings): resolve mobile OTP screen overlap and UI spacing",
      repoId: repo.id,
      description:
        "Resolved UI overlap issues on mobile OTP verification screens and improved spacing/layout for better mobile user experience during booking flow.",
      prUrl: "https://github.com/calcom/cal.diy/pull/29619",
      type: "bug-fix",
      techStack: JSON.stringify(["TypeScript", "React", "Mobile", "CSS"]),
      date: "Jun 2026",
      status: "closed",
      slug: "fix-bookings-mobile-otp-overlap-ui-spacing",
      image: null,
    },
    {
      title: "feat(calendar): autoscroll week view to first available slot",
      repoId: repo.id,
      description:
        "Implemented auto-scroll behavior in the calendar week view to automatically scroll to the first available time slot, improving usability and navigation for users booking appointments.",
      prUrl: "https://github.com/calcom/cal.diy/pull/29559",
      type: "feature",
      techStack: JSON.stringify(["TypeScript", "React", "Calendar", "UI"]),
      date: "Jun 2026",
      status: "closed",
      slug: "feat-calendar-autoscroll-week-view-first-slot",
      image: null,
    },
    {
      title: "feat(bookings): add overrideAvailability flag to v2 create endpoint",
      repoId: repo.id,
      description:
        "Added an overrideAvailability flag to the bookings v2 create API endpoint, allowing administrators to bypass availability checks when creating bookings programmatically.",
      prUrl: "https://github.com/calcom/cal.diy/pull/29533",
      type: "feature",
      techStack: JSON.stringify(["TypeScript", "Node.js", "API", "Backend"]),
      date: "Jun 2026",
      status: "closed",
      slug: "feat-bookings-override-availability-v2-endpoint",
      image: null,
    },
  ];

  for (const contribution of contributions) {
    await prisma.openSource.create({ data: contribution });
  }

  console.log("Seeded Cal.com data successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
