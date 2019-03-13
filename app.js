// creating modules

// BUDGET CONTROLLER
// function constructor for income and expenditure
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //data of the items that are added
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  //creating add item function
  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      //[1,2,3,4,5], next ID = 6
      //[1,2,4,6,8], next ID = 9
      //ID = last ID + 1

      //create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new item based on "inc" or "exp" type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //push it into our new data structure
      data.allItems[type].push(newItem);
      //return the new element
      return newItem;
    },
    testing: function() {
      console.log(data);
    }
  };
})();

// UI CONTROLLER
var UIController = (function() {
  // separating the DOM string slection  from the code
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list"
  };

  //creating & returning function to get the inputs
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // will be either inc or exp.
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },
    //creating and returning function to add the items list to the UI
    addListItem: function(obj, type) {
      var html, newHtml, element;
      // create html string with palceholder text
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    clearField: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMStrings.inputDescription + ", " + DOMStrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });

      fieldsArr[0].focus();
    },

    //returning DOM slection strings for access
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  //creating function t setup event listeners
  var setupEventListeners = function() {
    //using DOM slection strings function by storing it var
    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  //creating function to add item
  var ctrlAddItem = function() {
    var input, newItem;
    // 1. get the input field data
    input = UICtrl.getInput();
    // 2. add item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // 3. add item to the UI
    UICtrl.addListItem(newItem, input.type);
    // 4. clear the fields
    UICtrl.clearField();
    // 5. calclate the budget
    // 6. display the budget on the UI
  };

  //creating & returning the initialization function
  return {
    inIt: function() {
      console.log("APP HAS STARTED");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

//calling the initialization function
controller.inIt();
