app.controller('SetController', ['$scope', '$timeout', SetController])

function SetController($scope, $timeout){
  $scope.board = riggedBoard
  $scope.deck = deck
  $scope.points = 0
  $scope.selectedCards = []
  $scope.enableCardClicks = false
  $scope.addToSelectedCards = function($index){
    if ($scope.enableCardClicks) {
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
          $scope.isSet=false
          $timeout.cancel(prom)
          $scope.points--
          $scope.enableCardClicks = false
          $scope.selectedCards = []
          return false
        }
      }
      $timeout.cancel(prom)
      $scope.points++
      $scope.enableCardClicks = false
      $scope.selectedCards = []
      return true
    }
  }
  $scope.deductPoints = function() {
    $scope.points--
    $scope.enableCardClicks = false
  }
  $scope.set = function(){
    $scope.enableCardClicks = true
    prom = $timeout($scope.deductPoints,10000)
  }
}










function Card(colour,shape,shading,number){
  this.stats = [colour+1,shape+1,shading+1,number+1]

  this.display = (colour+1) +","+(shape+1)+","+(shading+1) +","+ (number+1)
}

function makeRiggedBoard(){
  board = []
  for (i=0;i<12;i++){
    board.push(new Card(i,i,i,i))
  }
  board.push(new Card(1,1,1,2))
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