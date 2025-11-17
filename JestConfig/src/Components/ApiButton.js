export default function ApiButton({ value }) {
  function calculate(x) {
    if (x > 10) {
      return "High";
    } else if (x > 5) {
      return "Medium";
    } else {
      return "Low";
    }
  }

  const result = calculate(value);

  return <p>{result}</p>;
}
