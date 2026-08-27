// Skip Husky install in production / CI / consumer installs.
// husky is a devDependency and is not installed in published packages'
// consumers — running `prepare` there would fail loudly. Per typicode's
// husky v9 docs (https://typicode.github.io/husky/how-to.html).
if (
  process.env.NODE_ENV === 'production' ||
  process.env.CI === 'true' ||
  process.env.HUSKY === '0'
) {
  process.exit(0);
}
const husky = (await import('husky')).default;
console.log(husky());