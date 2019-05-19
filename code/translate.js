makeFuck = function (s) {
  var code = s.replace(/ /g, '')
  code = code.replace(/plus/g, '+')
  code = code.replace(/minus/g, '-')
  code = code.replace(/less/g, '<')
  code = code.replace(/great/g, '>')
  code = code.replace(/dot/g, '.')
  code = code.replace(/comma/g, ',')
  code = code.replace(/begin/g, '[')
  code = code.replace(/end/g, ']')
  return code
}

function bf(program, input, debug, bits) {

  // default parameter values
  input = (input || '').split('');
  debug = (typeof debug === undefined) ? false : debug;
  bits = bits || 8;

  // setup and initialization
  var maxVal = Math.pow(2, bits) - 1;
  var a = new Array(); // data array
  var n = new Array(); // nesting level pointer array
  var op = 0;          // operation counter used in debug outputput
  var p = 0;           // data pointer
  var x = 0;           // x flag used when a loop is encountered and the assocated data pointer is already 0
  var output = '';

  // begin stepping through program
  // i is the instruction pointer
  for (var i = 0; i < program.length; i++) {
    if (debug) ++op;

    switch (program[i]) {
      case '>':
        incrementPointer(i);
        break;
      case '<':
        decrementPointer(i);
        break;
      case '+':
        incrementByte(i);
        break;
      case '-':
        decrementByte(i);
        break;
      case '.':
        outputByte(i);
        break;
      case ',':
        inputByte(i);
        break;
      case '[':
        beginLoop(i);
        break;
      case ']':
        i = endLoop(i);
        break;
      default:
        break;
    }
  }

  // empty arrays
  a = null;
  n = null;

  // return any output
  return output;

  function incrementPointer(i) {

    if (x) return;
    ++p;
  }

  function decrementPointer(i) {

    if (x) return;
    if (p > 0) {
      --p;
    }
  }

  function incrementByte(i) {

    if (x) return;
    if ((a[p] || 0) < maxVal) {
      a[p] = (a[p] || 0) + 1;
    }
    else {
      a[p] = 0;
    }
  }

  function decrementByte(i) {

    if (x) return;
    if ((a[p] || 0) > 0) {
      a[p] = (a[p] || 0) - 1;
    }
    else {
      a[p] = maxVal;
    }
  }

  function outputByte(i) {

    if (x) return;
    output = output + String.fromCharCode(a[p]);
  }

  function inputByte(i) {

    if (x != 0) {
      return;
    }
    var read = input.shift();
    if (read === undefined && program[i+1] == '+') a[p] = -1;
    else if (read === undefined) a[p] = 0;
    else a[p] = read.charCodeAt(0);
  }

  function beginLoop(i) {

    if (x != 0) {
      ++x;
      return;
    }
    if ((a[p] || 0) > 0) {
      n.push(i);
    }
    else {
      ++x;
    }
  }

  function endLoop(i) {

    if (x != 0) {
      --x;
      return i;
    }
    if ((a[p] || 0) > 0) {
      var origin = n.pop();
      i = origin - 1;
    }
    else {
      n.pop();
    }

    return i;
  }
}

module.exports.function = function translate (sentence) {
  var sentence = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.'
  var code = makeFuck(sentence)
  
  return bf(sentence)
}
