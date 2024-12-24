import React from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import RegisterSkillsCard from "../components/Teaching/RegisterSkillsCard";
import FindTeachersCard from "../components/Teaching/FindTeachersCard";
import SkillCategoriesCard from "../components/Teaching/SkillCategoriesCard";

const Teaching = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="flex flex-col items-center justify-between py-16 px-4 md:px-9 bg-gradient-to-r text-brown text-center">
      {/* Card Components */}
      <div className="w-full max-w-screen-lg flex flex-col md:flex-row md:flex-wrap gap-8">
        <RegisterSkillsCard />
        <FindTeachersCard />
        <SkillCategoriesCard />
      </div>
    </section>
  );
};

export default Teaching;
