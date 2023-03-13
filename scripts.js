// Get form inputs
let calculatorForm = $("#calculator-form");
let productTypeInput = $("input-product-type");
let rrpInput = $("#input-rrp");
let lifespanInput = $("#input-lifespan");
let refurbishmentInput = $("#input-refurbishment")  
let rentalPeriodInput = $("#input-rental-period");

// Get summary outputs
let totalReturnOutput = $("#output-total-return");
let refurbishmentOutput = $("#output-refurbishment");
let insuranceOutput = $("#output-insurance");
let chapterFee = $("#output-chapter-fee");
let monthlyCostOutput = $("#output-monthly-cost");
let rentalPeriodOutput = $("#rental-period");

// Handle rental period change
rentalPeriodInput.on("input", function() {
    let rentalPeriodInputValue = rentalPeriodInput.val();
  console.log(rentalPeriodInputValue);
  rentalPeriodOutput.text("For " + rentalPeriodInputValue + " months");
});

// Handle productTypeChange - not currently working, should be select
productTypeInput.on("input", function() {
  let productTypeInputValue = productTypeInput.is(':checked');
  console.log(productTypeInputValue)
});

const calculateDepreciation = (cost=10000, salvage=0, months=60, startPeriod=0, endPeriod=6) => {

  preventDefault()

    // Chapter costs
    let discount = 0.2;
    let refurbishmentFee = 0.1;
    let insuranceFee = 0.005;
    let chapterFee = 0.3;
    let discountedCost = cost * (1 - discount);

    // Using the 200% Double Declining Balance Depreciation Method
    // https://www.thebalancemoney.com/double-declining-balance-depreciation-method-357573
    let duration = endPeriod - startPeriod;
    let valueDecrease = discountedCost - salvage;
    let depreciationRate = (valueDecrease / months);
    let depreciationRatePercentage = depreciationRate / valueDecrease;
    let doubleDepreciationRatePercentage = depreciationRatePercentage * 2;
    let periodStartValue = discountedCost;
    let periodEndValue = discountedCost;
    let periodDepreciation;

    // Handle start period greater than 0 – I need to revisit this, it isn't quite working
    if (startPeriod > 0) {

      for (let i = 0; i < startPeriod; i += 1) {
        periodStartValue = periodStartValue * (1-doubleDepreciationRatePercentage); 
      }

      periodEndValue = periodStartValue;

      for (let i = startPeriod; i < endPeriod; i += 1) {
        periodEndValue = periodEndValue * (1-doubleDepreciationRatePercentage);
      }  
      periodDepreciation = periodStartValue - periodEndValue;
      console.log(periodStartValue);
      console.log(periodEndValue);
      console.log(periodDepreciation);

    } 
    // Handle start period when 0
    else {
        for (let i = startPeriod; i < endPeriod; i += 1) {
          periodEndValue = periodEndValue * (1-doubleDepreciationRatePercentage); 
        }
        periodDepreciation = discountedCost - periodEndValue;
        console.log(periodEndValue);
        console.log(periodDepreciation);
    }

    // Calculate total costs and fees
    let totalRefurbishmentCost = periodDepreciation * refurbishmentFee;
    let totalInsuranceCost = discountedCost * insuranceFee;
    let totalChapterFee = periodDepreciation * chapterFee;
    console.log(totalRefurbishmentCost, totalInsuranceCost, totalChapterFee);

    // Calculate monthly costs and fees
    let monthlyDepreciation = periodDepreciation / duration;
    let monthlyRefurbishmentCost = totalRefurbishmentCost / duration;
    let monthlyInsuranceCost = totalInsuranceCost / duration;
    let monthlyChapterFee = monthlyDepreciation * chapterFee;
    console.log(monthlyDepreciation, monthlyRefurbishmentCost, monthlyInsuranceCost, monthlyChapterFee);

    let monthlyRental = monthlyDepreciation + monthlyRefurbishmentCost + monthlyInsuranceCost + monthlyChapterFee;
    console.log(monthlyRental);

}

// Handle form submission
calculatorForm.submit(function( event ) {
  event.preventDefault();
  
  let rrpInputValue = rrpInput.val();
  let lifespanInputValue = lifespanInput.val() * 12;
  let rentalPeriodInputValue = rentalPeriodInput.val();
  
  console.log(rrpInputValue, lifespanInputValue, rentalPeriodInputValue)
  
  // Calculate the depreciation and update the summary
  calculateDepreciation(rrpInputValue, 0, lifespanInputValue, 0, rentalPeriodInputValue);
  
  // Do not submit the form
  return false;
});

// Handle summary update
const handleSummaryUpdate = (periodDepreciationValue = 10, totalRefurbishmentCostValue = 20, totalInsuranceCostValue = 30, totalChapterFeeValue = 40, monthlyRentalValue = 100) => {
  console.log(periodDepreciationValue, totalRefurbishmentCostValue, totalInsuranceCostValue, totalChapterFeeValue, monthlyRentalValue);
  totalReturnOutput.text("£" + periodDepreciationValue);
  refurbishmentOutput.text("£" + totalRefurbishmentCostValue);
  insuranceOutput.text("£" + totalInsuranceCostValue);
  chapterFee.text("£" + totalChapterFeeValue);
  monthlyCostOutput.text("£" + monthlyRentalValue);
}