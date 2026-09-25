const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Pradnya Gore/.gemini/antigravity-ide/brain/262cf6d0-abce-4bbf-9240-9a224d144c0a/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');
lines.forEach(l => {
  if (!l) return;
  const obj = JSON.parse(l);
  if (obj.type === 'PLANNER_RESPONSE' && obj.tool_calls) {
    obj.tool_calls.forEach(tc => {
      if (tc.name.includes('replace_file_content') || tc.name === 'write_to_file') {
        console.log(tc.name, tc.args.TargetFile);
      }
    });
  }
});
