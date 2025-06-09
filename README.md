# Using Playwright MCP server + GPT-4.1 for Test Creation

This repository showcases an advanced approach to automated browser testing, leveraging Playwright MCP servers and GPT-4.1 for efficient, scalable, and distributed test execution. My name is José Neto, a Quality Analyst with a focus on adopting emerging technologies to optimize software quality assurance workflows. For this project, I implemented automation for the [automationexercise.com](http://automationexercise.com) platform, which provides a comprehensive suite of test cases. 

By integrating MCP servers, I achieved a 40% improvement in test execution speed, enabling parallelization and distributed workload management. GPT-4.1 was utilized to assist in problem-solving and test optimization throughout the automation process.

For additional professional background, visit my [LinkedIn](https://www.linkedin.com/in/jdaneto/).

## Project Overview

This repository demonstrates how to:
- Integrate Playwright MCP servers to enable scalable, distributed browser automation and accelerate test creation.
- Employ GPT-4.1 to resolve automation challenges and optimize test case logic dynamically.
- Supervise, validate, and refine the automation pipeline to ensure robust and reliable test outcomes.

This solution is designed for teams seeking to enhance their end-to-end testing infrastructure with distributed execution and AI-driven optimization.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Execute the full Playwright test suite:
```bash
npx playwright test
```

- All test specifications are located in the `tests/` directory.
- To generate and view an HTML report after test execution:
```bash
npx playwright show-report
```

For advanced configuration and usage, refer to the [Playwright documentation](https://playwright.dev/).

---

**Note:** This project requires a correctly installed and configured Playwright MCP server to function as intended. For setup instructions and more information, refer to the [Playwright MCP server GitHub repository](https://github.com/microsoft/playwright-mcp-server).
