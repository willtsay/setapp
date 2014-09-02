app.controller('SetController', ['$scope', '$timeout', SetController])

function SetController($scope, $timeout){
  $scope.deck = makeObjectDeck
  $scope.board = makeSolvableBoard($scope.deck)
  $scope.points = 0
  $scope.selectedCards = []
  $scope.cardClicksEnabled = false
  $scope.answer = "hey"
  $scope.selectCard = function($index){
    if ($scope.cardClicksEnabled && $scope.cardNotYetSelected($index)) {
      if ($scope.cardNotYetSelected($index)){
        $scope.addToSelectedCards($index)
        if ($scope.threeCards()){
          if($scope.isSelectedSet()){
            $scope.points++
            $scope.replaceUsedCards()
            $scope.selectedCards = []
            if ($scope.checkResetNeeded(0)) {
              $scope.makeSolvableBoard()
            }
          } else {
            $scope.points--
          }
          $scope.resetStatuses()
        }
      }
    }
  }
  $scope.cardNotYetSelected = function($index){
      return ($.inArray($scope.board[$index], $scope.selectedCards) == -1)
  }
  $scope.addToSelectedCards = function($index){
    if (!$scope.board[$index].empty)
      $scope.selectedCards.push($scope.board[$index])
  }
  $scope.threeCards = function(){
    return $scope.selectedCards.length == 3
  }
  $scope.isSelectedSet = function(){
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
  $scope.inSelectedCards = function($index){
    return ($.inArray($scope.board[$index], $scope.selectedCards) != -1)
  }
  $scope.replaceUsedCards = function(){
    if ($scope.decklength < 3) { 
      for(i=0; i<3; i++) {
      var change = $scope.board.indexOf($scope.selectedCards[i])
      $scope.board[change] = new emptyCard()
      }
    } else {
      for (i=0; i<3; i++) {
        var change = $scope.board.indexOf($scope.selectedCards[i])
        $scope.board[change] = $scope.deck.splice(Math.floor(Math.random() * $scope.decklength), 1)[0]
      }
    }
  }
  $scope.attemptSet = function(){
    $scope.cardClicksEnabled = true
    prom = $timeout($scope.timePenalty,10000)
  }
  $scope.timePenalty = function(){
    $scope.points--
  }
  $scope.resetStatuses = function(){
    $timeout.cancel(prom)
    $scope.cardClicksEnabled = false
    $scope.selectedCards = []
  }
  $scope.checkResetNeeded = function(start){
    if (start == 10) {
      console.log('reset needed')
      return true
    } else {
      for(i = start+1; i < 11; i++) {
        var second = i
        for(b=second+1; b < 12; b++){

          if ($scope.isValidSet($scope.board[start],$scope.board[second],$scope.board[b])) {
            $scope.answer= (start+1)+","+(second+1)+","+(b+1)
            return false
          } 
        }     
      }
      return $scope.checkResetNeeded(start+1)
    }
  }
  $scope.makeSolvableBoard = function(){
    // move board back into deck, redeal the board.
    if ( $scope.decklength <= 20) {
      if ($scope.deckUnsolvable(0)){
        console.log("game over")
        return false
      }
    } else {
      $scope.reshuffle()
      $scope.makeBoard()
      if ($scope.checkResetNeeded(0)){
        return $scope.makeSolvableBoard()
      }
    }
  }
  $scope.deckUnsolvable = function(start){
    if (start == $scope.decklength-2) {
      return true
    } else {
      for(x = start+1; x < $scope.decklength-1; x++) {
        var second = x
        for(y=second+1; y < $scope.decklength; y++){
          if ($scope.isValidSet($scope.deck[start],$scope.deck[second],$scope.deck[y])) {
            $scope.reset = false
          } 
        }     
      }
      $scope.deckUnsolvable(start+1)
    }
  }
  $scope.isValidSet = function(card1,card2,card3){
    var c1=card1.stats,c2=card2.stats,c3=card3.stats
    if (card1.empty || card2.empty || card3.empty) {
      return false
    }
    for (c=0; c<4; c++) {
      if ((c1[c]==c2[c] && c2[c]==c3[c]) || (c1[c]!=c2[c] && c2[c]!=c3[c] && c1[c]!=c3[c])){   
      } else {
        return false
      }
    }
    return true
  }
  $scope.reshuffle = function(){
    for(card in $scope.board){
      $scope.deck[card.id] = card 
    }
    $scope.board = []
  }
  $scope.decklength = function(){
    return Object.keys($scope.deck).length
  }
  $scope.drawCard = function(){
    for (var cardId in $scope.deck) {
      if (Math.random() < 1/++count) {
        var card = $scope.deck[cardId]
        delete $scope.deck[cardId]
        return card                
      }
    }
  }
  $scope.makeBoard = function(){
    for (i = 0; i < 12; i++) {
      $scope.board[i] = $scope.drawCard()
    }
  }
}
//SET UP FUNCTIONS
function Card(id, colour,shape,shading,number){
  this.empty = false
  this.id = id
  this.shape_t = ["triangle","rectangle","diamond"]
  this.shading_t = ["border", "solid", "stripe"]
  this.number_t = [1,2,3]
  this.colour_t = ["b-01.png","g-01.png","r-01.png"]
  this.location = "/images/setimages/" + this.shape_t[shape] + "/"+ this.shading_t[shading] + "/"+ this.number_t[number] + this.colour_t[colour]
  this.stats = [shape+1,shading+1,number+1,colour+1]
}

function emptyCard(){
  this.empty = true
  this.location = "/images/setimages/emptyset.png"
}

function makeObjectDeck(){
  deck = {}
  for (i = 0; i < 81; i++){
    deck[i] = new Card(i, i%3, Math.floor(i/3)%3, Math.floor(i/9)%3, Math.floor(i/27)%3)
  }
  return deck
}



function makeSolvableBoard(deck){
  board = []
  for(i=0; i<12; i++){
    board.push(deck.splice(Math.floor(Math.random() * deck.length), 1)[0])
  }
  if (!solvableBoard(board,0)){
    console.log("attempt")
    deck = deck.concat(board)
    board = []
    return makeSolvableBoard(deck) 
  }
  return board
}
function solvableBoard(board,start){
  if (start == 10) {
    return false
  } else {
    for(i = start+1; i < 11; i++) {
      var second = i
      for(b=second+1; b < 12; b++){
        if (isValidSet(board[start],board[second],board[b])) {
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

// ======================DEBUGGING TYPE STUFF================================
// function makeRiggedBoard(){
//   board = []
//   for (i=0;i<12;i++){
//     board.push(new Card(i,i,i,i))
//   }
//   board.push(new Card(1,1,1,2))
//   return board
// }