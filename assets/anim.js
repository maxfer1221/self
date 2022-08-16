function setupTypewriter(t) {
    var HTML = t.innerHTML;
    t.innerHTML = "";

    var cursorPosition = 0,
    tag = "",
    writingTag = false,
    tagOpen = false,
    typeSpeed = 15,
    tempTypeSpeed = 0;
    variation = 70;

    var type = function() {
        if (writingTag === true) {
            tag += HTML[cursorPosition];
        }

        if (HTML[cursorPosition] === "<") {
            if(HTML[cursorPosition+1] === "a") {
              tagType = 'a';
            } else {
              tagType = 'span';
            }
            tempTypeSpeed = 0;
            if (tagOpen) {
                tagOpen = false;
                writingTag = true;
            } else {
                tag = "";
                tagOpen = true;
                writingTag = true;
                tag += HTML[cursorPosition];
            }
        }
        if (!writingTag && tagOpen) {
            tag.innerHTML += HTML[cursorPosition];
        }
        if (!writingTag && !tagOpen) {
            if (HTML[cursorPosition] === " ") {
                tempTypeSpeed = 0;
            }
            else {
                tempTypeSpeed = (Math.random() * variation) + typeSpeed;
            }
            t.innerHTML += HTML[cursorPosition];
        }
        if (writingTag === true && HTML[cursorPosition] === ">") {
            tempTypeSpeed = (Math.random() * variation) + typeSpeed;
            writingTag = false;
            if (tagOpen && tagType === 'span') {
                var newSpan = document.createElement("span");
                t.appendChild(newSpan);
                newSpan.innerHTML = tag;
                tag = newSpan.firstChild;
            } else if (tagOpen && tagType === 'a') {
              var newA = document.createElement("a");
              t.appendChild(newA);
              newA.innerHTML = tag;
              tag = newA.firstChild;
            }
        }
        if(HTML[cursorPosition + 1] === "\n") {
          tempTypeSpeed = 600;
        }
        if(HTML[cursorPosition + 1] === "\\" &&
           HTML[cursorPosition + 2] === "f"  &&
           HTML[cursorPosition + 3] === "n" ) {
             console.log('pos:', HTML[cursorPosition]);
          tempTypeSpeed = (Math.random() * variation) + typeSpeed;
          cursorPosition += 3;
        }
        cursorPosition += 1;
        if (cursorPosition < HTML.length - 1) {
            setTimeout(type, tempTypeSpeed);
        } else {
          finished = true;
        }
    };
    return {
        type: type
    };
}

function checkFinished() {
  if(finished) {
    clearInterval(interval);
  }
}

function showEmail() {
  let classes = document.getElementById('email').classList;
  if(emailHidden) {
    classes.remove('no-visibility');
    classes.remove('no-op');
  } else {
    classes.add('no-op');
    setTimeout(function (){classes.add('no-visibility')}, 700);
  }
  emailHidden = !emailHidden;
}

function clipboard() {
  let copyText = 'maximofernandez@knights.ucf.edu';
  navigator.clipboard.writeText(copyText);

  let classes = document.getElementById('copied').classList;
  classes.remove('no-op');
  setTimeout(function (){classes.add('no-op')}, 2500);
  // setTimeout(function (){flip(classes);}, 300);
  // setTimeout(function (){classes.add('no-op'); setTimeout(flip(classes), 3000);}, 2000);
}
//
// function flip(classes) {
//   if(classes.contains('fast-opacity-transition')){
//     classes.remove('fast-opacity-transition');
//     classes.add('slow-opacity-transition');
//   } else {
//     classes.add('fast-opacity-transition');
//     classes.remove('slow-opacity-transition');
//   }
// }

let emailHidden = true;
document.querySelector('.fa-envelope').onclick = showEmail;

let finished = false;
var typer = document.getElementById('typewriter');
let typewriter = setupTypewriter(typer);
typewriter.type();

let interval = setInterval(checkFinished, 50);

console.log('hi there!');
//partly from: https://codepen.io/stevn/pen/jEZvXa
