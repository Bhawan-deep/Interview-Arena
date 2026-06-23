const express = require("express");
const fs = require("fs");
const { exec, spawn } = require("child_process");
const crypto = require("crypto");


const router = express.Router();
const os = require("os");
const path = require("path");
function getUniqueId() {
  return crypto.randomUUID();
}
function runProcess(command, args, input, res) {

  const child = spawn(command, args);

  let responded = false;

  const timer = setTimeout(() => {

    child.kill();

    if (!responded) {

      responded = true;

      return res.json({
        stdout: "",
        stderr: "Time Limit Exceeded (5 seconds)"
      });

    }

  }, 5000);

  if (input) {
    child.stdin.write(input);
  }

  child.stdin.end();

  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  child.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  child.on("close", () => {

    clearTimeout(timer);

    if (!responded) {

      responded = true;

      return res.json({
        stdout,
        stderr,
      });

    }

  });

}

router.post("/", (req, res) => {
  try {
      const id = getUniqueId();
    const { code, language ,input} = req.body;

    let filePath;
  

    if (language === "javascript") {
      filePath = path.join(os.tmpdir(),`temp-${id}.js`);
fs.writeFileSync(filePath, code);

return runProcess(
  "node",
  [filePath],
  input,
  res
);
    }

    else if (language === "python") {
   filePath = path.join(
  os.tmpdir(),
  `temp-${id}.py`
);
  fs.writeFileSync(filePath, code);

  return runProcess(
    "python3",
    [filePath],
    input,
    res
  );
    }

    else if (language === "cpp") {

  const exePath = path.join(
    os.tmpdir(),
    `main-${id}`
  );

  filePath = path.join(
    os.tmpdir(),
    `main-${id}.cpp`
  );

  fs.writeFileSync(filePath, code);

  exec(
    `g++ ${filePath} -o ${exePath}`,
    (error, stdout, stderr) => {

      if (error) {
        return res.json({
          stdout: "",
          stderr,
        });
      }

      return runProcess(
        exePath,
        [],
        input,
        res
      );

    }
  );

  return;
}

    else if (language === "java") {
    filePath = path.join(
  os.tmpdir(),
  "Main.java"
);

fs.writeFileSync(filePath, code);

exec(
  `cd ${os.tmpdir()} && javac Main.java`,
  (error, stdout, stderr) => {

    if (error) {
      return res.json({
        stdout: "",
        stderr,
      });
    }

    runProcess(
      "java",
      ["-cp", os.tmpdir(), "Main"],
      input,
      res
    );
  }
);

return;
    }

    else {
      return res.status(400).json({
        error: "Unsupported language",
      });
    }

   
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;