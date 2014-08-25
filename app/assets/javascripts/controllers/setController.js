app.controller('SetController', ['$scope', SetController])

function SetController($scope){
  $scope.board = board
  $scope.deck = deck
  $scope.selectedCards = []
  $scope.addToSelectedCards = function($index){
    if ($.inArray($index, $scope.selectedCards) != -1) {
      return null
    } else {
      if ($scope.selectedCards.length >= 3) {
        if ($scope.selectedCards.length == 3) {
          
        }
        $scope.selectedCards.shift()
      }
      $scope.selectedCards.push($index)
    }
    $scope.isSet()
  }
  $scope.inSelectedCards = function($index){
    if ($.inArray($index, $scope.selectedCards) != -1)
      return true
  }
  $scope.isSet = function(){
    if ($scope.selectedCards.length == 3){
      return true
    }
  }

}

function makeDeck(){
  deck = []
  for (i = 0; i < 81; i++){
    card = [i%3, Math.floor(i/3)%3, Math.floor(i/9)%3, Math.floor(i/27)%3]
    deck.push(card.toString())
  }
  return deck
}


var deck = makeDeck()
var board = makeBoard(deck)
function makeBoard(deck){
  board = []
  for(i=0; i<12; i++){
    board.push(deck.splice(Math.floor(Math.random() * deck.length), 1)[0])
  }
  return board
}