import Section from "./Section";
import Heading from "./Heading";

const stack = [
  { title: "Frontend", items: "React.js, HTML5, CSS3, JavaScript" },
  { title: "Backend", items: "Python, FastAPI (REST API)" },
  { title: "Database", items: "MySQL" },
  { title: "AI / Deep Learning", items: "CNN, Transfer Learning" },
  { title: "Libraries", items: "PyTorch, torchvision, Pillow, NumPy, OpenCV, Scikit-Learn, ReportLab" },
  { title: "Tools", items: "Visual Studio Code, Git & GitHub, Docker" },
];

const TechStack = () => (
  <Section id="technology">
    <div className="container relative z-2">
      <Heading
        title="Technologies Behind TumorTech"
        text="A React website talks to a FastAPI backend, which runs the trained CNN and stores every result in MySQL."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {stack.map((s) => (
          <div key={s.title} className="p-8 bg-n-7 border border-n-1/10 rounded-3xl">
            <h5 className="h5 mb-3">{s.title}</h5>
            <p className="body-2 text-n-3">{s.items}</p>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

export default TechStack;
