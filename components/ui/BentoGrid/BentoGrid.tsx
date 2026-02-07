import type { ReactNode } from "react";
import { useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";

import Lottie from "react-lottie";

import { cn, downloadFile } from "@/lib/utils";
import styles from "./BentoGrid.module.css";

import animationData from "@/data/confetti.json";
import { Button } from "../../button/Button";
import { BackgroundGradientAnimation } from "../GradientBg";
import GridGlobe from "../GridGlobe";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return <div className={cn(styles.bentoGrid, className)}>{children}</div>;
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  id: number;
  title?: string | ReactNode;
  description?: string | ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const leftLists = ["Python", "Java", "TypeScript"];
  const rightLists = ["ReactJS", "SQL", "MongoDb"];
  const fileName = "Binit_s_Resume.pdf";

  const [copied, setCopied] = useState(false);

  const defaultOptions = {
    loop: copied,
    autoplay: copied,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // copy to clipboard function
  const handleCopy = () => {
    const text = "binitnayak48@gmail.com";
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const handleDownload = () => {
    downloadFile(`/assests/${fileName}`, fileName);
  };

  return (
    <div className={cn(styles.bentoGridItem, className)}>
      <div
        className={
          id === 6
            ? styles.bentoGridItem__container_flex
            : styles.bentoGridItem__container
        }
      >
        <div className={styles.bentoGridItem__imageWrapper}>
          {img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={img}
              className={cn(styles.bentoGridItem__image, imgClassName)}
            />
          )}
        </div>
        <div
          className={
            id === 5
              ? styles.bentoGridItem__spareImageWrapper_full
              : styles.bentoGridItem__spareImageWrapper
          }
        >
          {spareImg && (
            <img
              src={spareImg}
              alt={spareImg}
              className={styles.bentoGridItem__spareImage}
            />
          )}
        </div>
        {id === 6 && (
          <BackgroundGradientAnimation>
            <div className={styles.bentoGridItem__gradientAnimation} />
          </BackgroundGradientAnimation>
        )}

        <div className={cn(styles.bentoGridItem__titleSection, titleClassName)}>
          <div className={styles.bentoGridItem__description}>{description}</div>
          <div className={styles.bentoGridItem__title}>{title}</div>

          {id === 2 && <GridGlobe />}

          {id === 3 && (
            <div className={styles.bentoGridItem__techStack}>
              {/* tech stack lists */}
              <div className={styles.bentoGridItem__techStackColumn}>
                {leftLists.map((item, i) => (
                  <span key={i} className={styles.bentoGridItem__techStackItem}>
                    {item}
                  </span>
                ))}
                <span
                  className={styles.bentoGridItem__techStackItem_empty}
                ></span>
              </div>
              <div className={styles.bentoGridItem__techStackColumn}>
                <span
                  className={styles.bentoGridItem__techStackItem_empty}
                ></span>
                {rightLists.map((item, i) => (
                  <span key={i} className={styles.bentoGridItem__techStackItem}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {id === 6 && (
            <div className={styles.bentoGridItem__contact}>
              <div className={styles.bentoGridItem__lottie}>
                <Lottie options={defaultOptions} height={200} width={400} />
              </div>

              <Button
                title={copied ? "Email is Copied!" : "Copy my email address"}
                icon={<IoCopyOutline />}
                position="left"
                handleClick={handleCopy}
                otherClasses={styles.bentoGridItem__emailButton}
              />
              <Button
                title={"My Resume"}
                icon={<FaFileAlt />}
                position="left"
                handleClick={handleDownload}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
