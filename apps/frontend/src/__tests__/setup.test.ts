import "@testing-library/jest-dom";

describe("Jest setup", () => {
  it("deve ter o ambiente configurado corretamente", () => {
    expect(true).toBe(true);
  });

  it("deve ter acesso ao jsdom", () => {
    // document existe no jsdom mas não no Node.js puro
    expect(document).toBeDefined();
    expect(window).toBeDefined();
  });

  it("deve ter @testing-library/jest-dom configurado", () => {
    // toBeInTheDocument é um matcher do jest-dom
    // se esse teste passar, o setup está correto
    const element = document.createElement("div");
    document.body.appendChild(element);
    expect(element).toBeInTheDocument();
  });
});
