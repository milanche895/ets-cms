import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    id: "spike-robot",
    title: "Spike робот",
    slug: "spike-robot",
    summary: "Екипа склапа робота од Lego Spike сета и вежба задатке за Прву Лего лигу.",
    image: "/images/school/lego-robotica.jpg",
    imageAlt: "Коцке за школски пројекат роботике",
  },
  {
    id: "ev3-robot",
    title: "EV3 робот",
    slug: "ev3-robot",
    summary: "Старија екипа користи EV3 сет да вежба кретање, сензоре и прецизне задатке.",
    image: "/images/school/EV3-lego-robot.jpg",
    imageAlt: "Роботска рука, илустрација техничког пројекта",
  },
  {
    id: "programiranje",
    title: "Програмирање",
    slug: "programiranje",
    summary: "Ученици праве мале апликације и тако повезују градиво са практичним радом.",
    image: "/images/school/AI_Startup01.jpg",
    imageAlt: "Програмски код на екрану",
  },
  {
    id: "skolski-projekti",
    title: "Школски пројекти",
    slug: "skolski-projekti",
    summary: "Заједнички радови ученика и наставника из електронике, рачунара и мрежа.",
    image: "/images/school/SajamTehnikeETS01.jpg",
    imageAlt: "Учионица током наставе",
  },
];
