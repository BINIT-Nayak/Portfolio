import { gridItems } from "@/data";
import { BentoGrid, BentoGridItem } from "../ui/BentoGrid";
import style from "./Grid.module.css";

export const Grid = () => {
  return (
    <section id="about" className={style.section}>
      <BentoGrid>
        {gridItems.map((item, index) => (
          <BentoGridItem
            id={item.id}
            key={index}
            title={item.title}
            description={item.description}
            className={item.className}
            img={item.img}
            imgClassName={item.imgClassName}
            titleClassName={item.titleClassName}
            spareImg={item.spareImg}
          />
        ))}
      </BentoGrid>
    </section>
  );
};
