var ClozeCard = function (text, cloze) {
  this.fullText = text;
  this.cloze = cloze;
  this.deletion = text.replace(cloze, ' ... ');
};

module.exports = ClozeCard;
