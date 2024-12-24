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
    <section className="flex flex-col items-center justify-center py-12 bg-gradient-to-r text-brown text-center">
      {/* Card Components */}
      <RegisterSkillsCard />
      <FindTeachersCard />
      <SkillCategoriesCard />
      
      {/* Call-to-Action Button */}
      
    </section>
  );
};

export default Teaching;
