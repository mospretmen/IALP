const express = require('express');
const router = express.Router({
	mergeParams: true
});
const loans = require('../data/loans.json');
const _ = require('lodash');
const median = require('median');
const fs = require("fs");

// ------------> MONTHLY SUMMARY

var StatesRaw = [];
var States = [];
var SubjectAppraisedAmountArr = [];
var LoanAmountArr = [];
var InterestRateArr = [];

// Create array and push raw data values to arrays.
for (var i = 0; i < loans.length; i++) {
	SubjectAppraisedAmountArr.push(loans[i].SubjectAppraisedAmount);
	LoanAmountArr.push(loans[i].LoanAmount);
	InterestRateArr.push(loans[i].InterestRate);
	StatesRaw.push(loans[i].SubjectState);
}

var monthlySummary = {
	LoanAmountSummary: {
		Sum: _.sum(LoanAmountArr),
		Average: _.sum(LoanAmountArr) / LoanAmountArr.length,
		Median: median(LoanAmountArr),
		Minimum: _.min(LoanAmountArr),
		Maximum: _.max(LoanAmountArr)
	},
	SubjectAppraisedAmountSummary: {
		Sum: _.sum(SubjectAppraisedAmountArr),
		Average: _.sum(SubjectAppraisedAmountArr) / SubjectAppraisedAmountArr.length,
		Median: median(SubjectAppraisedAmountArr),
		Minimum: _.min(SubjectAppraisedAmountArr),
		Maximum: _.max(SubjectAppraisedAmountArr)
	},
	InterestRateSummary: {
		Sum: _.sum(InterestRateArr),
		Average: _.sum(InterestRateArr) / InterestRateArr.length,
		Median: median(InterestRateArr),
		Minimum: _.min(InterestRateArr),
		Maximum: _.max(InterestRateArr)
	}
}

// Sort unique states from RAW State array.
function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

var a = StatesRaw;
var States = a.filter(onlyUnique).sort();

// ------------> MONTHLY SUMMARY BY STATE

var arrByState = [];

for (var i = 0; i < loans.length; i++) {
	arrByState.push({
		SubjectState: loans[i].SubjectState,
		SubjectAppraisedAmount: loans[i].SubjectAppraisedAmount,
		LoanAmount: loans[i].LoanAmount,
		InterestRate: loans[i].InterestRate
	});
}

// let groupByState = _.groupBy(arrByState, "SubjectState" );	

var monthlySummaryByState = [];
for (var j = 0; j < States.length; j++) {
	var apprArr = [];
	var loanArr = [];
	var intArr = [];
	for (var k = 0; k < arrByState.length; k++) {
		if (arrByState[k].SubjectState === States[j]) {
			apprArr.push(arrByState[k].SubjectAppraisedAmount);
			loanArr.push(arrByState[k].LoanAmount);
			intArr.push(arrByState[k].InterestRate);
		}
	}
	var objByState = {
			SubjectState: States[j],
			LoanAmountSummary: {
				Sum: _.sum(loanArr),
				Average: _.sum(loanArr) / loanArr.length,
				Median: median(loanArr),
				Minimum: _.min(loanArr),
				Maximum: _.max(loanArr)
			},
			SubjectAppraisedAmountSummary: {
				Sum: _.sum(apprArr),
				Average: _.sum(apprArr) / apprArr.length,
				Median: median(apprArr),
				Minimum: _.min(apprArr),
				Maximum: _.max(apprArr)
			},
			InterestRateSummary: {
				Sum: _.sum(intArr),
				Average: _.sum(intArr) / intArr.length,
				Median: median(intArr),
				Minimum: _.min(intArr),
				Maximum: _.max(intArr)
			}
	}
	monthlySummaryByState.push(objByState);
}

console.log(monthlySummaryByState);

router.get('/', (req, res) => {
	res.render('home',{monthlySummary: monthlySummary, monthlySummaryByState: monthlySummaryByState});
});

router.get('/monthlySummaryJSON', (req, res) => {
	res.json({monthlySummary: monthlySummary});
});

router.get('/monthlySummaryByStateJSON', (req, res) => {
	res.json({monthlySummaryByState: monthlySummaryByState});
});

module.exports = router;