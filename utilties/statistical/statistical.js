const jstat = require("jstat");
const ttest = require("ttest");
const Correlation = require("node-correlation");

function welchTTest(dataset1, dataset2, alt) {
  console.log(
    ttest(dataset1, dataset2, {
      mu: 0,
      varEqual: true,
      alpha: 0.3,
      alternative: alt
    }).pValue()
  );
  return ttest(dataset1, dataset2, {
    mu: 0,
    varEqual: true,
    alpha: 0.3,
    alternative: alt
  }).valid();
}

function square(a) {
  return a * a;
}

function mean(dataSet) {
  return (
    dataSet.reduce((a, b) => {
      return a + b;
    }) / dataSet.length
  );
}

function standardDeviation(dataSet) {
  return Math.sqrt(variance(dataSet));
}

function variance(dataSet) {
  const average = mean(dataSet);
  return mean(
    dataSet.map(function(num) {
      return Math.pow(num - average, 2);
    })
  );
}

function lowest(dataSet) {
  return Math.min(...dataSet);
}

function highest(dataSet) {
  return Math.max(...dataSet);
}

function correlation(dataset1, dataset2) {
  console.log("yoyoyyoyyoyoy");
  var correlation = Correlation.calc(dataset1, dataset2);
  var correlationBounds = [1, 0.9, 0.5, 0, -0.5, -0.9, -1];
  console.log(correlation);
  var answer = "";
  if (correlation === 1) {
    answer = "Perfect Postive Correlation";
  }

  if (correlation < 1 && correlation >= 0.9) {
    answer = "High Postive Correlation";
  }

  if (correlation < 0.5 && correlation >= 0) {
    answer = "Low Correlation";
  }

  if (correlation < 0.5 && correlation > -0.5) {
    answer = "Low Correlation";
  }

  if (correlation >= -0.5 && correlation < -0.9) {
    answer = "Low Negative Correlation";
  }

  if (correlation < -1 && correlation >= -0.9) {
    answer = "High Negative Correlation";
  }

  if (correlation === -1) {
    answer = "Perfect Negative Correlation";
  }
  console.log("qwerty");
  console.log(answer);
  return { text: answer, value: correlation };
}

module.exports = {
  welchTTest: welchTTest,
  square: square,
  mean: mean,
  standardDeviation: standardDeviation,
  variance: variance,
  lowest: lowest,
  highest: highest,
  correlation: correlation
};
