export const cls = (classes) => {
  const classList = Object.keys(classes).filter((cls) => classes[cls]);

  return classList.join(" ");
};
