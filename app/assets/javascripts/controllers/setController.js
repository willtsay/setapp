// to add
// board set checking 
// replacing cards
// graphics
// animations


app.controller('SetController', ['$scope', '$timeout', SetController])

function SetController($scope, $timeout){
  $scope.solvable = solvable
  $scope.board = board
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

// var riggedBoard = makeRiggedBoard()

var deck = makeDeck()
var board = makeBoard(deck)
function makeBoard(deck){
  board = []
  for(i=0; i<12; i++){
    board.push(deck.splice(Math.floor(Math.random() * deck.length), 1)[0])
  }
  return board
}

function solvableBoard(board,start){
  console.log(start)
  if (start == 10) {
    return false
  } else {

    for(i = start+1; i < 11; i++) {
      var second = i
      console.log(start + "," + i)
      for(b=second+1; b < 12; b++){
        console.log(start+","+ second+","+b)
        if (isAnswer(start,second,b)) {
          console.log("IT'S HAPPENING")
          return true
        }

      }     
    }
    solvableBoard(board,start+1)
  }
}

var solvable = solvableBoard(board,0)

function isAnswer(card1,card2,card3){
  var c1=board[card1].stats,c2=board[card2].stats,c3=board[card3].stats
  for (c=0; c<4; c++) {
    if ((c1[c]==c2[c] && c2[c]==c3[c]) || (c1[c]!=c2[c] && c2[c]!=c3[c] && c1[c]!=c3[c])){   

    } else {
      return false
    }
  }
  return true
}
