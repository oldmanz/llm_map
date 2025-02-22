interface ButtonProps {
  title: string;
  count: number;
  handleClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, count, handleClick }) => {
  return (
    <button onClick={handleClick}>
      {title} {count}
    </button>
  );
};

export default Button;
