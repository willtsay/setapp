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
  $scope.deck = makeDeck()
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
            $scope.replaceUsedCardsPlus()
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
  $scope.replaceUsedCardsPlus = function(){
    for (i=0; i<3; i++) {
      var change = $scope.board.indexOf($scope.selectedCards[i])
      $scope.board[change] = $scope.deck.splice(Math.floor(Math.random() * $scope.deck.length), 1)[0]
       if (i == 2) {
        $scope.selectedCards = []
          if ($scope.checkResetNeeded(0)) {
            $scope.makeSolvableBoard()
          }
       }
    }
  }
  $scope.attemptSet = function(){
    $scope.cardClicksEnabled = true
    prom = $timeout($scope.timePenalty,5000)
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
    if ($scope.deck.length <= 20) {
      return false
    } else {
      $scope.selectedCards = []
      $scope.deck = $scope.deck.concat($scope.board)
      $scope.board = []
      for(w=0; w<12; w++){
        $scope.board.push($scope.deck.splice(Math.floor(Math.random() * $scope.deck.length), 1)[0])
      }
      if ($scope.checkResetNeeded(0)){
        return $scope.makeSolvableBoard()
      }
    }
  }
  $scope.deckUnsolvable = function(start){
    if (start == $scope.deck.length-2) {
      return true
    } else {
      for(x = start+1; x < $scope.deck.length-1; x++) {
        var second = x
        for(y=second+1; y < $scope.deck.length; y++){
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
    for (c=0; c<4; c++) {
      if ((c1[c]==c2[c] && c2[c]==c3[c]) || (c1[c]!=c2[c] && c2[c]!=c3[c] && c1[c]!=c3[c])){   
      } else {
        return false
      }
    }
    return true
  }
  $scope.arrayIntersect = function(a, b){
    var result = new Array();
    while( a.length > 0 && b.length > 0 )
    {  
       if      (a[0] < b[0] ){ a.shift(); }
       else if (a[0] > b[0] ){ b.shift(); }
       else /* they're equal */
       {
         result.push(a.shift());
         b.shift();
       }
    }
    return result;
  }
}
//SET UP FUNCTIONS
function Card(colour,shape,shading,number){
  this.shape_t = ["triangle","rectangle","diamond"]
  this.shading_t = ["border", "solid", "stripe"]
  this.number_t = [1,2,3]
  this.colour_t = ["b-01.png","g-01.png","r-01.png"]
  this.location = "/images/setimages/" + this.shape_t[shape] + "/"+ this.shading_t[shading] + "/"+ this.number_t[number] + this.colour_t[colour]
  this.stats = [colour+1,shape+1,shading+1,number+1]
}

function makeDeck(){
  deck = []
  for (i = 0; i < 81; i++){
    deck.push(new Card(i%3, Math.floor(i/3)%3, Math.floor(i/9)%3, Math.floor(i/27)%3))
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

