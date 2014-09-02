app.controller('SetController', ['$scope', '$timeout', SetController])

function SetController($scope, $timeout){
  $scope.deck = makeObjectDeck()
  $scope.board = makeFirstSolvableBoard($scope.deck)
  $scope.points = 0
  $scope.selectedCards = []
  $scope.cardClicksEnabled = false
  $scope.answer = "hey"
  $scope.gameOver = false
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
  $scope.drawCard = function(){
    var keys = Object.keys($scope.deck)
    var randomProp = keys[Math.floor(Math.random()*keys.length)]
    var card = $scope.deck[randomProp] 
    delete $scope.deck[randomProp]
    return card

  }
  $scope.checkResetNeeded = function(start){
    if (start == 10) {
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
    for (i= 0; i<12; i++){
      $scope.deck[$scope.board[i].id] = $scope.board[i]
    }
    $scope.board = []
  }

  $scope.decklength = function(){
    return Object.keys($scope.deck).length
  }
  $scope.deckUnsolvable = function(start,deck){
    if (start >= deck.length-2) {
      return true
    } else {
      for(x = start+1; x < deck.length-1; x++) {
        var second = x
        for(y=second+1; y < deck.length; y++){
          if ($scope.isValidSet(deck[start],deck[second],deck[y])) {
            return false
          } 
        }     
      }
      return $scope.deckUnsolvable(start+1, deck)
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
    if ($scope.decklength() < 3) { 
      for(i=0; i<3; i++) {
      var change = $scope.board.indexOf($scope.selectedCards[i])
      $scope.board[change] = new emptyCard()
      }
    } else {
      for (i=0; i<3; i++) {
        var change = $scope.board.indexOf($scope.selectedCards[i])
        $scope.board[change] = $scope.drawCard()
      }
    }
  }
  $scope.attemptSet = function(){
  if (!$scope.gameOver) { 
    $scope.cardClicksEnabled = true
    prom = $timeout($scope.timePenalty,10000)
    }
  }
  $scope.timePenalty = function(){
    $scope.points--
  }
  $scope.resetStatuses = function(){
    $timeout.cancel(prom)
    $scope.cardClicksEnabled = false
    $scope.selectedCards = []
  }
  $scope.makeBoard = function(){
    for (i = 0; i < 12; i++) {
      $scope.board[i] = $scope.drawCard()
    }
  }
  $scope.makeSolvableBoard = function(){
    // move board back into deck, redeal the board.
    if ( $scope.decklength() <= 20) {
      var deckAsArray = []
      for(card in $scope.deck){
        deckAsArray.push($scope.deck[card])
      } 
      if ($scope.deckUnsolvable(0, deckAsArray)){
        console.log("game over")
        $scope.gameOver = true
        return
      }
    } else {
      $scope.reshuffle()
      $scope.makeBoard()
      if ($scope.checkResetNeeded(0)){
        return $scope.makeSolvableBoard()
      }
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

function drawCard(deck){
  var keys = Object.keys(deck)
  var randomProp = keys[Math.floor(Math.random()*keys.length)] 
  var card = deck[randomProp]
  delete deck[randomProp]
  return card
  // var count = 0

  // for (var cardId in deck) {
  //   if (Math.random() < 1/++count) {
  //     var card = deck[cardId]
  //     delete deck[cardId]
  //     return card       
  //   }
  // }
}


function makeFirstSolvableBoard(deck){
  board = []
  for (i=0;i<12;i++) {
    board.push(drawCard(deck))
  }
  if (!solvableBoard(board,0)) {
    reshuffle(board, deck)
    return makeFirstSolvableBoard(deck)
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
    return solvableBoard(board,start+1)
  }
}

function reshuffle(board, deck){
  for (i= 0; i<12; i++){
    deck[board[i].id] = board[i]
  }
  board = []
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

