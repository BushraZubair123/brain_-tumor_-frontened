import Section from "./Section";

const Footer = () => {
  return (
    <Section crosses className="!px-0 !py-10">
      <div className="container flex flex-col items-center gap-3 text-center">
        <p className="caption text-n-4">
          © {new Date().getFullYear()} TumorTech — Final Year Project, Department of Information Technology
        </p>
        <p className="caption text-n-4">
          TumorTech is a decision-support tool. It does not replace a doctor's diagnosis.
        </p>
      </div>
    </Section>
  );
};

export default Footer;
