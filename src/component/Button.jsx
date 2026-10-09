import { Link } from "react-router-dom";
import ButtonSvg from "../assets/svg/ButtonSvg";

const Button = ({ className, href, onClick, children, px, white, disabled, type = "button" }) => {
  const classes = `button relative inline-flex items-center justify-center h-11 transition-colors hover:text-color-1 ${
    px || "px-7"
  } ${white ? "text-n-8" : "text-n-1"} ${className || ""}`;
  const spanClasses = "relative z-10";

  if (href) {
    const inner = (
      <>
        <span className={spanClasses}>{children}</span>
        {ButtonSvg(white)}
      </>
    );
    // In-app page -> router Link, anchors / external -> normal <a>
    return href.startsWith("/") && !href.startsWith("/#") ? (
      <Link to={href} className={classes}>
        {inner}
      </Link>
    ) : (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white)}
    </button>
  );
};

export default Button;
