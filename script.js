import './style.css';

const questions = [
  {
    category: 'HTML BASICS',
    prompt: 'Which language is used to structure the content of a webpage?',
    answers: ['HTML', 'CSS', 'JavaScript', 'Python'],
    correct: 'HTML',
    explanation: 'HTML provides the structure and meaning of a webpage, like headings, paragraphs, and links.'
  },
  {
    category: 'HTML BASICS',
    prompt: 'Which HTML element creates the largest page heading?',
    answers: ['<heading>', '<h6>', '<h1>', '<title>'],
    correct: '<h1>',
    explanation: 'The h1 element is the top-level heading. A page usually uses it for its main title.'
  },
  {
    category: 'WEB FOUNDATIONS',
    prompt: 'What does CSS mainly control on a webpage?',
    answers: ['The page’s appearance', 'The database', 'The web address', 'The browser history'],
    correct: 'The page’s appearance',
    explanation: 'CSS controls presentation, including colors, spacing, typography, and layout.'
  }
];

const app = document.querySelector('#app');

const state = {
  screen: 'start',
  current: 0,
  score: 0,
  selected: null,
  submitted: false
};

function render() {
  if (state.screen === 'start') {
    app.innerHTML = renderStart();
    bindStart();
    return;
  }

  if (state.screen === 'results') {
    app.innerHTML = renderResults();
    bindResults();
    return;
  }

  app.innerHTML = renderQuiz();
  bindQuiz();
}

function renderShell(content, eyebrow = 'QUIZLY / HTML STARTER') {
  return `
    <main class="page-shell">
      <header class="topbar">
        <a class="brand" href="#" data-reset aria-label="Quizly home">
          <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
          <span>quizly</span>
        </a>
        <div class="topbar-note">LEARN BY ANSWERING</div>
      </header>
      <div class="content-wrap">
        <div class="eyebrow"><span class="eyebrow-dot"></span>${eyebrow}</div>
        ${content}
      </div>
      <footer class="footer-note">A tiny practice space for curious beginners.</footer>
    </main>
  `;
}

function renderStart() {
  return renderShell(`
    <section class="intro-layout" aria-labelledby="welcome-title">
      <div class="intro-copy">
        <p class="kicker">THREE QUESTIONS / ONE QUICK WIN</p>
        <h1 id="welcome-title">Build your web<br /><em>confidence.</em></h1>
        <p class="intro-text">A short, friendly quiz on HTML and CSS basics. Take your best guess, learn from the feedback, and leave with one more thing you know.</p>
        <button class="button button-primary start-button" type="button" data-start>
          Start the quiz <span aria-hidden="true">→</span>
        </button>
        <p class="microcopy"><span class="micro-dot"></span> No pressure. Just three questions.</p>
      </div>
      <aside class="start-card" aria-label="Quiz overview">
        <div class="card-label">QUICK BRIEF</div>
        <div class="brief-row"><span class="brief-icon purple">01</span><span><strong>Answer</strong><small>Choose the option that feels right.</small></span></div>
        <div class="brief-row"><span class="brief-icon green">02</span><span><strong>Learn</strong><small>Get a clear explanation after each answer.</small></span></div>
        <div class="brief-row"><span class="brief-icon yellow">03</span><span><strong>Finish</strong><small>See your score and try again anytime.</small></span></div>
        <div class="brief-footer"><span>3 questions</span><span>~2 minutes</span></div>
      </aside>
    </section>
    <section class="principles" aria-label="Quiz principles">
      <div><span class="principle-number">01</span><strong>Function first</strong><p>Simple tools help ideas stick.</p></div>
      <div><span class="principle-number">02</span><strong>Feedback matters</strong><p>Every answer teaches you something.</p></div>
      <div><span class="principle-number">03</span><strong>Progress is progress</strong><p>One question at a time is enough.</p></div>
    </section>
  `);
}

function renderQuiz() {
  const question = questions[state.current];
  const progress = ((state.current + (state.submitted ? 1 : 0)) / questions.length) * 100;
  const isCorrect = state.selected === question.correct;

  return renderShell(`
    <section class="quiz-header" aria-labelledby="question-title">
      <div>
        <p class="kicker">QUESTION ${String(state.current + 1).padStart(2, '0')} <span>/ ${String(questions.length).padStart(2, '0')}</span></p>
        <h1 id="question-title">A quick check-in<br /><em>for your brain.</em></h1>
      </div>
      <div class="score-card" aria-label="Current score"><span>YOUR SCORE</span><strong>${state.score}<small>/${questions.length}</small></strong></div>
    </section>
    <div class="progress-line" aria-label="Quiz progress"><span style="width: ${progress}%"></span></div>
    <section class="question-card" aria-live="polite">
      <div class="question-meta"><span class="question-category">${question.category}</span><span class="question-count">${state.current + 1} of ${questions.length}</span></div>
      <h2>${question.prompt}</h2>
      <div class="answers" role="radiogroup" aria-label="Answer choices">
        ${question.answers.map((answer, index) => renderAnswer(answer, index, isCorrect)).join('')}
      </div>
      ${state.submitted ? renderFeedback(question, isCorrect) : `
        <button class="button button-primary submit-button" type="button" data-submit ${state.selected === null ? 'disabled' : ''}>
          Check answer <span aria-hidden="true">→</span>
        </button>
      `}
    </section>
    <div class="quiz-tip"><span class="tip-mark">i</span><span>Trust your first instinct. You can always try the quiz again.</span></div>
  `);
}

function renderAnswer(answer, index, isCorrect) {
  let className = 'answer-option';
  if (state.selected === answer) className += ' selected';
  if (state.submitted && answer === questions[state.current].correct) className += ' correct';
  if (state.submitted && state.selected === answer && answer !== questions[state.current].correct) className += ' incorrect';

  const status = state.submitted && answer === questions[state.current].correct ? '<span class="answer-status">✓</span>' : '';
  return `
    <button class="${className}" type="button" data-answer="${escapeAttribute(answer)}" ${state.submitted ? 'disabled' : ''}>
      <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
      <span>${answer}</span>
      ${status}
    </button>
  `;
}

function renderFeedback(question, isCorrect) {
  if (isCorrect) {
    return `
      <div class="feedback feedback-success">
        <div class="feedback-icon">✓</div>
        <div><strong>Nice work — that’s correct.</strong><p>${question.explanation}</p></div>
      </div>
      <button class="button button-primary submit-button" type="button" data-next>${state.current === questions.length - 1 ? 'See my result' : 'Next question'} <span aria-hidden="true">→</span></button>
    `;
  }

  return `
    <div class="feedback feedback-neutral">
      <div class="feedback-icon">i</div>
      <div><strong>Not quite — keep going.</strong><p>The best answer is <b>${question.correct}</b>. ${question.explanation}</p></div>
    </div>
    <button class="button button-primary submit-button" type="button" data-next>${state.current === questions.length - 1 ? 'See my result' : 'Next question'} <span aria-hidden="true">→</span></button>
  `;
}

function renderResults() {
  const percentage = Math.round((state.score / questions.length) * 100);
  const message = percentage === 100 ? 'You’re on a roll.' : percentage >= 66 ? 'You’ve got a strong start.' : 'Every attempt is a step forward.';
  return renderShell(`
    <section class="results-layout" aria-labelledby="results-title">
      <div class="results-copy">
        <p class="kicker">QUIZ COMPLETE / WELL DONE</p>
        <h1 id="results-title">You made it<br /><em>to the finish.</em></h1>
        <p class="intro-text">${message} Take a moment to celebrate what you know, then run it back when you’re ready.</p>
        <button class="button button-primary" type="button" data-restart>Try it again <span aria-hidden="true">↗</span></button>
      </div>
      <div class="result-card">
        <div class="card-label">YOUR RESULT</div>
        <div class="result-score">${state.score}<span>/${questions.length}</span></div>
        <div class="result-bar"><span style="width: ${percentage}%"></span></div>
        <p>You answered <strong>${state.score} out of ${questions.length}</strong> questions correctly.</p>
        <div class="result-tag"><span class="tag-dot"></span>${percentage >= 66 ? 'FOUNDATIONS ARE CLICKING' : 'KEEP PRACTICING'}</div>
      </div>
    </section>
    <section class="result-note"><span class="note-icon">+</span><div><strong>Small steps add up.</strong><p>Repetition is how a new idea becomes something you can use.</p></div></section>
  `);
}

function bindStart() {
  document.querySelector('[data-start]').addEventListener('click', () => {
    state.screen = 'quiz';
    render();
  });
  bindResetLink();
}

function bindQuiz() {
  document.querySelectorAll('[data-answer]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selected = button.dataset.answer;
      render();
    });
  });

  const submit = document.querySelector('[data-submit]');
  if (submit) {
    submit.addEventListener('click', () => {
      state.submitted = true;
      if (state.selected === questions[state.current].correct) state.score += 1;
      render();
    });
  }

  const next = document.querySelector('[data-next]');
  if (next) {
    next.addEventListener('click', () => {
      if (state.current === questions.length - 1) {
        state.screen = 'results';
      } else {
        state.current += 1;
        state.selected = null;
        state.submitted = false;
      }
      render();
    });
  }
  bindResetLink();
}

function bindResults() {
  document.querySelector('[data-restart]').addEventListener('click', resetQuiz);
  bindResetLink();
}

function bindResetLink() {
  document.querySelectorAll('[data-reset]').forEach((element) => element.addEventListener('click', (event) => {
    event.preventDefault();
    resetQuiz();
  }));
}

function resetQuiz() {
  state.screen = 'start';
  state.current = 0;
  state.score = 0;
  state.selected = null;
  state.submitted = false;
  render();
}

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

render();
