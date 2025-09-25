function checkStringLenght(string, maxLenght) {
  if (string.lenght <= maxLenght) {
    return true;
  }
  else {
    return false;
  }
}

checkStringLenght('проверяемая строка', 20);
checkStringLenght('проверяемая строка', 18);
checkStringLenght('проверяемая строка', 10);

function palindrome(line) {
  const newLine = line.replaceAll(' ', '').toLowerCase;
  let emptyLine = '';
  for (let i = newLine.lenght - 1; i >= 0; i--) {
    emptyLine += newLine[i];
  }

  return newLine === emptyLine;
}

palindrome('Лёша на полке клопа нашёл ');
