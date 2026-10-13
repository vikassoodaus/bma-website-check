import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const C = {
  ink: rgb(11/255,48/255,44/255),
  dark: rgb(7/255,61/255,54/255),
  text: rgb(72/255,99/255,93/255),
  muted: rgb(113/255,131/255,126/255),
  line: rgb(223/255,232/255,228/255),
  white: rgb(1,1,1),
  blue: rgb(234/255,243/255,255/255),
  lilac: rgb(240/255,235/255,255/255),
  peach: rgb(255/255,240/255,231/255),
  mint: rgb(233/255,246/255,239/255),
  sage: rgb(237/255,245/255,236/255),
  blush: rgb(255/255,237/255,239/255),
};

const PAGE = { w: 595.28, h: 841.89, margin: 46 };

function wrap(font, text, size, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) line = test;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrapped(page, font, text, x, y, size, maxWidth, color=C.text, lineHeight=size*1.4) {
  const lines = wrap(font, text, size, maxWidth);
  let cursor = y;
  for (const line of lines) {
    page.drawText(line, { x, y: cursor, size, font, color });
    cursor -= lineHeight;
  }
  return cursor;
}

function title(page, bold, regular, kicker, heading, sub) {
  page.drawText(kicker.toUpperCase(), {
    x: PAGE.margin, y: PAGE.h - 64, size: 9, font: bold, color: C.muted,
  });
  const after = drawWrapped(page, bold, heading, PAGE.margin, PAGE.h - 92, 30, PAGE.w - PAGE.margin*2, C.ink, 33);
  if (sub) drawWrapped(page, regular, sub, PAGE.margin, after - 10, 11, PAGE.w - PAGE.margin*2, C.text, 16);
}

function footer(page, regular, pageNo) {
  page.drawLine({
    start: { x: PAGE.margin, y: 40 },
    end: { x: PAGE.w - PAGE.margin, y: 40 },
    thickness: 1,
    color: C.line,
  });
  page.drawText('Business Marketing Agency • businessmarketingagency.com.au', {
    x: PAGE.margin, y: 24, size: 8, font: regular, color: C.muted,
  });
  page.drawText(String(pageNo), {
    x: PAGE.w - PAGE.margin - 8, y: 24, size: 8, font: regular, color: C.muted,
  });
}

function categoryName(key) {
  return ({
    performance:'Performance & Mobile',
    conversion:'Conversion & UX',
    trust:'Trust & Credibility',
    seo:'SEO Foundations',
    technical:'Technical Health',
    tracking:'Analytics & Tracking',
  })[key] || key;
}

export async function createWebsiteCheckPdf({ lead, scan }) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const domain = scan?.website?.domain || 'Website';
  const overall = scan?.score?.overall;
  const scoreText = overall === null || overall === undefined
    ? String(Math.round(scan?.score?.confirmedScore || 0))
    : String(Math.round(overall));

  // Page 1
  let page = pdf.addPage([PAGE.w, PAGE.h]);
  page.drawRectangle({ x:0, y:0, width:PAGE.w, height:PAGE.h, color:C.white });
  page.drawRectangle({ x:0, y:PAGE.h-10, width:PAGE.w, height:10, color:C.dark });
  page.drawText('BUSINESS MARKETING AGENCY', {
    x:PAGE.margin, y:PAGE.h-72, size:10, font:bold, color:C.muted,
  });
  drawWrapped(page, bold, 'Your Free Website Check', PAGE.margin, PAGE.h-122, 34, 380, C.ink, 38);
  page.drawText(domain, { x:PAGE.margin, y:PAGE.h-210, size:14, font:regular, color:C.text });

  page.drawCircle({ x:PAGE.w-135, y:PAGE.h-178, size:72, color:C.blue });
  const scoreWidth = bold.widthOfTextAtSize(scoreText, 44);
  page.drawText(scoreText, {
    x:PAGE.w-135-scoreWidth/2, y:PAGE.h-192, size:44, font:bold, color:C.dark,
  });
  page.drawText('out of 100', {
    x:PAGE.w-166, y:PAGE.h-220, size:9, font:regular, color:C.muted,
  });

  page.drawText(scan?.score?.label || 'Website Check Result', {
    x:PAGE.margin, y:PAGE.h-275, size:22, font:bold, color:C.ink,
  });
  drawWrapped(
    page, regular,
    `Prepared for ${lead.firstName}${lead.businessName ? ` at ${lead.businessName}` : ''}. This report summarises the automated checks completed by BMA and highlights the areas worth looking at first.`,
    PAGE.margin, PAGE.h-308, 11, PAGE.w-PAGE.margin*2, C.text, 17
  );

  page.drawRectangle({
    x:PAGE.margin, y:250, width:PAGE.w-PAGE.margin*2, height:160,
    color:C.sage, borderColor:C.line, borderWidth:1,
  });
  page.drawText('The idea is simple', {
    x:PAGE.margin+20, y:378, size:15, font:bold, color:C.ink,
  });
  drawWrapped(page, regular,
    'A website should look credible, make the next step obvious, load well on mobile, be discoverable in search, work technically and give you enough tracking to understand what happens next.',
    PAGE.margin+20, 350, 12, PAGE.w-PAGE.margin*2-40, C.text, 19
  );
  footer(page, regular, 1);

  // Page 2: category results
  page = pdf.addPage([PAGE.w, PAGE.h]);
  title(page, bold, regular, 'Your result', 'Six website signals', 'A practical snapshot of the areas most likely to affect visibility, trust and enquiries.');
  const colors = [C.blue,C.lilac,C.peach,C.mint,C.sage,C.blush];
  const entries = Object.entries(scan?.categories || {});
  let y = 650;
  entries.forEach(([key, cat], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = PAGE.margin + col * 255;
    const yy = y - row * 142;
    page.drawRectangle({ x, y:yy, width:235, height:118, color:colors[index] || C.sage, borderColor:C.line, borderWidth:1 });
    page.drawText(categoryName(key), { x:x+16, y:yy+86, size:11, font:bold, color:C.ink });
    const display = cat.score === null ? 'Not fully verified' : `${cat.score} / ${cat.max}`;
    const size = cat.score === null ? 16 : 26;
    page.drawText(display, { x:x+16, y:yy+48, size, font:bold, color:C.dark });
    const note = cat.score === null
      ? `${cat.verifiedEarned} / ${cat.verifiedMax} verified points`
      : (cat.partial ? 'Some supporting data could not be verified.' : 'Core checks completed.');
    drawWrapped(page, regular, note, x+16, yy+24, 8.5, 202, C.text, 11);
  });
  footer(page, regular, 2);

  // Page 3: opportunities
  page = pdf.addPage([PAGE.w, PAGE.h]);
  title(page, bold, regular, 'Priority', 'Your biggest opportunities', 'These are prioritised by likely business impact, not by how technical they sound.');
  let cursor = 650;
  const issues = (scan?.topIssues || []).slice(0,3);
  if (!issues.length) {
    page.drawRectangle({ x:PAGE.margin, y:500, width:PAGE.w-PAGE.margin*2, height:130, color:C.mint, borderColor:C.line, borderWidth:1 });
    page.drawText('No high-priority issues detected', { x:PAGE.margin+18, y:590, size:16, font:bold, color:C.ink });
    drawWrapped(page, regular, 'This website passed the core checks in the current BMA Website Check model.', PAGE.margin+18, 562, 11, PAGE.w-PAGE.margin*2-36, C.text, 16);
  } else {
    issues.forEach((issue,index)=>{
      page.drawCircle({ x:PAGE.margin+18, y:cursor+5, size:15, color:C.lilac });
      page.drawText(String(index+1), { x:PAGE.margin+14, y:cursor, size:10, font:bold, color:C.dark });
      page.drawText(issue.title, { x:PAGE.margin+45, y:cursor+2, size:14, font:bold, color:C.ink });
      let yy = drawWrapped(page, regular, issue.text, PAGE.margin+45, cursor-24, 10, PAGE.w-PAGE.margin*2-45, C.text, 14);
      yy = drawWrapped(page, bold, issue.recommendation, PAGE.margin+45, yy-4, 10, PAGE.w-PAGE.margin*2-45, C.ink, 14);
      cursor = yy - 34;
    });
  }
  footer(page, regular, 3);

  // Page 4: wins
  page = pdf.addPage([PAGE.w, PAGE.h]);
  title(page, bold, regular, 'Keep these', "What's already working", 'The strongest parts of the current website foundation.');
  cursor = 650;
  const wins = (scan?.wins || []).slice(0,6);
  wins.forEach((win,index)=>{
    const bg = colors[index % colors.length];
    page.drawRectangle({ x:PAGE.margin, y:cursor-58, width:PAGE.w-PAGE.margin*2, height:82, color:bg, borderColor:C.line, borderWidth:1 });
    page.drawText('✓', { x:PAGE.margin+16, y:cursor, size:13, font:bold, color:C.dark });
    page.drawText(win.title, { x:PAGE.margin+38, y:cursor, size:12, font:bold, color:C.ink });
    drawWrapped(page, regular, win.text, PAGE.margin+38, cursor-21, 9.5, PAGE.w-PAGE.margin*2-54, C.text, 13);
    cursor -= 98;
  });
  footer(page, regular, 4);

  // Page 5: 30-day plan
  page = pdf.addPage([PAGE.w, PAGE.h]);
  title(page, bold, regular, 'Action plan', 'A simple 30-day priority plan', 'Use the strongest issues first. Avoid trying to fix everything at once.');
  const planIssues = issues.length ? issues : [{title:'Protect what is already working', recommendation:'Keep the current foundations stable and recheck performance after meaningful site changes.'}];
  const weeks = [
    ['Week 1', planIssues[0]],
    ['Week 2', planIssues[1] || planIssues[0]],
    ['Week 3', planIssues[2] || planIssues[0]],
    ['Week 4', { title:'Measure and recheck', recommendation:'Review the changes, test the enquiry or shopping journey and run the Website Check again.' }],
  ];
  cursor = 650;
  weeks.forEach(([label,item],index)=>{
    page.drawRectangle({ x:PAGE.margin, y:cursor-62, width:84, height:76, color:colors[index % colors.length] });
    page.drawText(label, { x:PAGE.margin+16, y:cursor-22, size:11, font:bold, color:C.dark });
    page.drawText(item.title, { x:PAGE.margin+104, y:cursor, size:13, font:bold, color:C.ink });
    drawWrapped(page, regular, item.recommendation, PAGE.margin+104, cursor-24, 10, PAGE.w-PAGE.margin*2-104, C.text, 15);
    cursor -= 112;
  });
  footer(page, regular, 5);

  // Page 6: next step
  page = pdf.addPage([PAGE.w, PAGE.h]);
  page.drawRectangle({ x:0, y:0, width:PAGE.w, height:PAGE.h, color:C.dark });
  page.drawText('BUSINESS MARKETING AGENCY', {
    x:PAGE.margin, y:PAGE.h-72, size:10, font:bold, color:rgb(.78,.87,.84),
  });
  drawWrapped(page, bold, 'Start with the problem. Fix what matters first.', PAGE.margin, PAGE.h-132, 34, PAGE.w-PAGE.margin*2, C.white, 39);
  drawWrapped(page, regular,
    'BMA helps businesses improve websites, SEO, advertising, CRM, automation and AI as one connected growth system. You do not need every service. Start with the biggest gap.',
    PAGE.margin, PAGE.h-245, 12, PAGE.w-PAGE.margin*2, rgb(.82,.89,.87), 19
  );
  page.drawRectangle({ x:PAGE.margin, y:370, width:PAGE.w-PAGE.margin*2, height:150, color:rgb(.06,.29,.26), borderColor:rgb(.2,.42,.38), borderWidth:1 });
  page.drawText('Want help with the findings?', { x:PAGE.margin+22, y:480, size:18, font:bold, color:C.white });
  drawWrapped(page, regular, 'Tell us what you are trying to improve and we will help you work out the most sensible next step.', PAGE.margin+22, 448, 11, PAGE.w-PAGE.margin*2-44, rgb(.84,.91,.89), 17);
  page.drawText('businessmarketingagency.com.au/contact-us', { x:PAGE.margin+22, y:396, size:12, font:bold, color:C.white });
  page.drawText('Melbourne, Australia', { x:PAGE.margin, y:42, size:9, font:regular, color:rgb(.7,.82,.79) });

  return await pdf.save();
}
