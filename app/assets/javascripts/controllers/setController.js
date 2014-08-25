app.controller('SetController', ['$scope', SetController])

function SetController($scope){
  $scope.board = board
  $scope.deck = deck
  $scope.selectedCards = []
  $scope.addToSelectedCards = function($index){
    if ($.inArray($scope.board[$index], $scope.selectedCards) != -1) {
      return null
    } else {
      if ($scope.selectedCards.length >= 3) {
        $scope.selectedCards.shift()
      }
      $scope.selectedCards.push($scope.board[$index])
      if ($scope.selectedCards.length == 3) {
        if ($scope.isItSet()) {
          $scope.isSet=true
        }
      }
    }
    console.log($scope.selectedCards)
  }
  $scope.inSelectedCards = function($index){
    if ($.inArray($scope.board[$index], $scope.selectedCards) != -1)
      return true
  }
  $scope.isSet = false
  $scope.isItSet = function(){
    if ($scope.selectedCards.length == 3){
      var c1 = $scope.selectedCards[0].stats, c2 = $scope.selectedCards[1].stats, c3 = $scope.selectedCards[2].stats,check = 0
      for (i=0; i<4; i++) {
        if ((c1[i]==c2[i] && c2[i]==c3[i]) || (c1[i]!=c2[i] && c2[i]!=c3[i] && c1[i]!=c3[i])){   
        } else {
          console.log("FALS")
          return false
        }
      }
      return true
    }
  }

}

function Card(colour,shape,shading,number){
  this.stats = [colour+1,shape+1,shading+1,number+1]

  this.display = (colour+1) +","+(shape+1)+","+(shading+1) +","+ (number+1)
}

function makeRiggedBoard(){
  board = []
  for (i=0;i<12;i++){
    board.push(new Card(1,1,1,1))
  }
  return board
}
function makeDeck(){
  deck = []
  for (i = 0; i < 81; i++){
    deck.push(new Card(i%3, Math.floor(i/3)%3, Math.floor(i/9)%3, Math.floor(i/27)%3))
  }
  return deck
}

var riggedBoard = makeRiggedBoard()

var deck = makeDeck()
var board = makeBoard(deck)
function makeBoard(deck){
  board = []
  for(i=0; i<12; i++){
    board.push(deck.splice(Math.floor(Math.random() * deck.length), 1)[0])
  }
  return board
}