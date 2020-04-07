var currentList = {};

function createShoppingList()
{
    currentList.name = $("#shoppingListName").val();
    currentList.items = new Array();
    //webservice call

    $.ajax(
        {
            type: "POST",
            dataType: "json",
            url: "api/ShoppingList/",
            data: currentList,
            success: function (result) {
                showShoppingList();
            }
        });

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
    newItem.shoppingListId = currentList.id;
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
        $.ajax(
            {
                type: "POST",
                dataType: "json",
                url: "api/Item/",
                data: newItem,
                success: function (result) {
                    currentList = result;
                    drawItems();
                    //once the item is added set the value to null
                    $("#newItemName").val("");
                }
            });
        
    }
    

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
            $("<button onclick = 'deleteItem(" + currentItem.id + ")'>D</button>").appendTo($li);
        var $checkBtn =
            $("<button onclick = 'checkItem(" + currentItem.id + ")'>C</button>").appendTo($li);

        if (currentItem.checked)
        {
            $li.addClass("checked");
        }
        $li.appendTo($list);
    }
}

function deleteItem(itemId)
{
    $.ajax(
        {
            type: "DELETE",
            dataType: "json",
            url: "api/Item/" + itemId,
            
            success: function (result) {
                currentList = result;
                drawItems();
            }
        });
    
}

function checkItem(itemId)
{
    var changedItem = {};
    for (i = 0; i < currentList.items.length; i++)
    {
        if (currentList.items[i].id == itemId)
        {
            changedItem = currentList.items[i];
        }
    }
    changedItem.checked = !changedItem.checked;
    $.ajax(
        {
            type: "PUT",
            dataType: "json",
            url: "api/Item/" + itemId,
            data: changedItem,
            success: function (result) {
                currentList = result;
                drawItems();
            }
        });
}

function getShoppingListById(id)
{
    $.ajax(
        {
            type: "GET",
            dataType: "json",
            url: "api/ShoppingList/" + id,
            success: function (result)
            {
                currentList = result;
                showShoppingList();
                drawItems();
            }
        })
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