// to add
// board set checking  DONE
// replacing cards (ON USE )


// refactor/additional functions
// graphics
// animations
// multiplexer 
// endless
// users etc. 
// porting to other stuffs

app.controller('SetController', ['$scope', '$timeout', SetController])

function SetController($scope, $timeout){
  $scope.board = board
  $scope.deck = deck
  $scope.points = 0
  $scope.selectedCards = []
  $scope.cardClicksEnabled = false
  $scope.isSet = false
  $scope.selectCard = function($index){
    if ($scope.cardClicksEnabled) {
      if ($scope.cardNotYetSelected($index)){
        $scope.addToSelectedCards($index)
        if ($scope.threeCards()) {
          if($scope.isValidSet()){
            $scope.points++
            $scope.replaceUsedCards()
          } else {
            $scope.points--
          }
          $scope.refreshBoard()
        }
      }
    }
  }
  $scope.cardNotYetSelected = function($index){
      return ($.inArray($scope.board[$index], $scope.selectedCards) == -1)
  }
  $scope.addToSelectedCards = function($index){
    $scope.selectedCards.push($scope.board[$index])
  }
  $scope.threeCards = function(){
    return $scope.selectedCards.length == 3
  }
  $scope.isValidSet = function(){
    var c1 = $scope.selectedCards[0].stats
    var c2 = $scope.selectedCards[1].stats
    var c3 = $scope.selectedCards[2].stats
    for (c=0; c<4; c++) {
      if ((c1[c]==c2[c] && c2[c]==c3[c]) || (c1[c]!=c2[c] && c2[c]!=c3[c] && c1[c]!=c3[c])){   
      } else {
        return false
      }
    }
    return true
  }
  $scope.replaceUsedCards = function(){
    console.log($scope.deck.length)
    for (i=0; i<3; i++) {
      var change = $scope.board.indexOf($scope.selectedCards[i])
      $scope.board[change] = $scope.deck.splice(Math.floor(Math.random() * deck.length), 1)[0]
    }
  }
  $scope.attemptSet = function(){
    $scope.cardClicksEnabled = true
    prom = $timeout($scope.deductPoints,10000)
  }
  
  $scope.refreshBoard = function(){
    $timeout.cancel(prom)
    $scope.enableCardClicks = false
    $scope.selectedCards = []
  }
  $scope.inSelectedCards = function($index){
    return ($.inArray($scope.board[$index], $scope.selectedCards) != -1)
  }
}

function Card(colour,shape,shading,number){
  this.shape_t = ["triangle","rectangle","diamond"]
  this.shading_t = ["border", "solid", "stripe"]
  this.number_t = [1,2,3]
  this.colour_t = ["b-01.png","g-01.png","r-01.png"]

  this.location = "/images/setimages/" + this.shape_t[shape] + "/"+ this.shading_t[shading] + "/"+ this.number_t[number] + this.colour_t[colour]
  this.stats = [colour+1,shape+1,shading+1,number+1]
  this.display = (colour+1) +","+(shape+1)+","+(shading+1) +","+ (number+1)
}
function makeDeck(){
  deck = []
  for (i = 0; i < 81; i++){
    deck.push(new Card(i%3, Math.floor(i/3)%3, Math.floor(i/9)%3, Math.floor(i/27)%3))
  }
  return deck
}
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
        if (isValidSet(board[start],board[second],board[b])) {
          console.log("there be a set")
          return true
        }
      }     
    }
    solvableBoard(board,start+1)
  }
}
function isValidSet(card1,card2,card3){
  var c1=card1.stats,c2=card2.stats,c3=card3.stats
  for (c=0; c<4; c++) {
    if ((c1[c]==c2[c] && c2[c]==c3[c]) || (c1[c]!=c2[c] && c2[c]!=c3[c] && c1[c]!=c3[c])){   
    } else {
      return false
    }
  }
  return true
}

var deck = makeDeck()
var board = makeBoard(deck)
var solvable = solvableBoard(board,0)
// ======================DEBUGGING TYPE STUFF================================
// function makeRiggedBoard(){
//   board = []
//   for (i=0;i<12;i++){
//     board.push(new Card(i,i,i,i))
//   }
//   board.push(new Card(1,1,1,2))
//   return board
// }