var currentList = {};

function createShoppingList()
{
    currentList.name = $("#shoppingListName").val();
    currentList.items = new Array();
    //webservice call
    showShoppingList();
}

function showShoppingList()
{
    $("#shoppingListTitle").html(currentList.name);
    $("#shoppingListItems").empty();
    $("#createListDiv").hide();
    $("#shoppingListDiv").show();
    $("#newItemName").focus();
    $("#newItemName").keyup(function (event) {
        //on return key 
        if (event.keyCode == 13)
            addItem();
    })
}

function addItem()
{
    var newItem = {};
    newItem.name = $("#newItemName").val();
    var itemAdded = false;
    
    for (i = 0; i < currentList.items.length; i++)
    {
        var currentItem = currentList.items[i];
        if (currentItem.name.toLowerCase() == newItem.name.toLowerCase())
        {
            itemAdded = true;
            break;
        }
       
    }
    if (!itemAdded)
    {
        currentList.items.push(newItem);
        console.info(currentList);
        drawItems();
    }
    //once the item is added set the value to null
    $("#newItemName").val("");

}

function drawItems()
{
    var $list = $("#shoppingListItems").empty();
    for (i = 0; i < currentList.items.length; i++)
    {
        var currentItem = currentList.items[i];
        var $li = $("<li>").html(currentItem.name)
            .attr("id", "item_" + i);
        var $deleteBtn =
            $("<button onclick = 'deleteItem(" + i + ")'>D</button>").appendTo($li);
        var $checkBtn =
            $("<button onclick = 'checkItem(" + i + ")'>C</button>").appendTo($li);
        $li.appendTo($list);
    }
}

function deleteItem(index)
{
    currentList.items.splice(index, 1);
    drawItems();
}

function checkItem(index)
{
    if ($("#item_" + index).hasClass("checked"))
        $("#item_" + index).removeClass("checked");
    else
        $("#item_" + index).addClass("checked");
}

function getShoppingListById(id)
{
    console.info(id);
    currentList.name = "Mock Shopping List";
    currentList.items = [
        { name: "Milk" },
        { name: "salad"},
        { name: "Fruits" }
    ];
    showShoppingList();
    drawItems();
}

$(document).ready(function () {
    console.info("ready");
    $("#shoppingListName").focus();
    $("#shoppingListName").keyup(function (event) {
        //on return key 
        if (event.keyCode == 13)
            createShoppingList();
    })

    var pageUrl = window.location.href;
    var idIndex = pageUrl.indexOf("?id=");
    if (idIndex != -1)
        getShoppingListById(pageUrl.substring(idIndex + 4))
})