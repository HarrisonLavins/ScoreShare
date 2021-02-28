const calculateEditDistance = (
  original: string,
  updated: string,
  cursorAtEnd: boolean
) => {
  if (cursorAtEnd) {
    original = original.split("").reverse().join("");
    updated = updated.split("").reverse().join("");
  }

  // Initialize dynamicProgrammingArray and steps array
  const dynamicProgrammingArray = [[0]];
  const steps = [[""]];
  // The first row contains all inserts
  for (let col = 1; col <= updated.length; col++) {
    dynamicProgrammingArray[0].push(col);
    steps[0].push(steps[0][col - 1] + "I");
  }
  for (let row = 1; row <= original.length; row++) {
    const rowArray = [row]; // The first column contains all deletes
    steps.push([steps[row - 1][0] + "D"]);
    for (let col = 1; col <= updated.length; col++) {
      rowArray.push(0);
      steps[row].push("");
    }
    dynamicProgrammingArray.push(rowArray);
  }

  // Calculate the edit distance
  for (let row = 0; row < original.length; row++) {
    for (let col = 0; col < updated.length; col++) {
      if (original.charAt(row) === updated.charAt(col)) {
        // If the last character matches, carry down the edit distance
        dynamicProgrammingArray[row + 1][col + 1] =
          dynamicProgrammingArray[row][col];
        steps[row + 1][col + 1] = steps[row][col] + " ";
      } else {
        // The last character has an edit
        const fastestOperation = Math.min(
          dynamicProgrammingArray[row][col], // Replace
          dynamicProgrammingArray[row + 1][col], // Insert
          dynamicProgrammingArray[row][col + 1] // Delete
        );
        dynamicProgrammingArray[row + 1][col + 1] = 1 + fastestOperation;
        if (fastestOperation === dynamicProgrammingArray[row][col]) {
          steps[row + 1][col + 1] = steps[row][col] + "R"; // Replace
        } else if (fastestOperation === dynamicProgrammingArray[row + 1][col]) {
          steps[row + 1][col + 1] = steps[row + 1][col] + "I"; // Insert
        } else if (fastestOperation === dynamicProgrammingArray[row][col + 1]) {
          steps[row + 1][col + 1] = steps[row][col + 1] + "D"; // Delete
        }
      }
    }
  }
  return cursorAtEnd
    ? steps[original.length][updated.length].split("").reverse().join("")
    : steps[original.length][updated.length];
};

export const determineEdits = (
  original: string,
  updated: string,
  cursorPosition: number
) => {
  const lengthDiff = updated.length - original.length;
  return (
    calculateEditDistance(
      original.substring(0, cursorPosition - lengthDiff),
      updated.substring(0, cursorPosition),
      true
    ) +
    calculateEditDistance(
      original.substr(cursorPosition - lengthDiff),
      updated.substr(cursorPosition),
      false
    )
  );
};
