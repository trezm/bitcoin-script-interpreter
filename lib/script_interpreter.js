// Some extra array functions to make it act more like a stack
Array.prototype.peak = function( n ) {
    n = typeof n === 'undefined' ? this.length - 1 : n;
    n = n < 0 ? this.length + n : n;
    return this[ n ];
}

function ScriptInterpreter( inputString ) {
    this.dataStack = [];
    this.altStack = [];
    
    this.parseInput( inputString );
}

ScriptInterpreter.prototype = {
    constructor: ScriptInterpreter,

    textToFunction: function( op ) {
	console.log( "Executing op: " + op );
	
	// Constants
	if ( op === 'OP_0' ||
	     op === 'OP_FALSE' ) {
	    this.dataStack.push( [] );
	} else if ( op === 'OP_PUSHDATA1' ) {

	} else if ( op === 'OP_PUSHDATA2' ) {

	} else if ( op === 'OP_PUSHDATA4' ) {

	} else if ( op === 'OP_1NEGATE' ) {
	    this.dataStack.push( -1 );
	} else if ( op === 'OP_1' ||
		    op === 'OP_TRUE' ) {
	    this.dataStack.push( 1 );
	} else if ( op === 'OP_2' /* @TODO through 16 */ ) {
	    this.dataStack.push( 2 );
	}

	// Flow Control
	else if ( op === 'OP_NOP' ) {
	    // do nothing
	} else if ( op === 'OP_IF' ) {
	    var top = this.dataStack.pop();
	    if ( top != 0 &&
	         top != [] ) {
		// Do nothing
	    } else {
		var interveningIfs = 0;
		var i = -1;
		var next = this.opStack.peak( i );
 		while ( true ) {
		    if ( next == 'OP_IF' ) { interveningIfs++; }
		    if ( next == 'OP_ENDIF' ) { interveningIfs--; }
		    if ( interveningIfs == 0 &&
			 ( next == 'OP_ELSE' ||
			   next == 'OP_ENDIF' ) ) {
			this.opStack = this.opStack.slice( this.opStack, this.opStack.length + i, -1 * i );
			break;
		    }
		    i--;
		    next = this.opStack.peak( i );
		}
	    }
	} else if ( op === 'OP_NOTIF' ) {

	} else if ( op === 'OP_ELSE' ) {
	    var interveningIfs = 0;
	    var i = -1;
	    var next = this.opStack.peak( i );
	    
	    while ( true ) {
		if ( next == 'OP_IF' ) { interveningIfs++; }
		if ( next == 'OP_ENDIF' ) { interveningIfs--; }
		if ( interveningIfs <= 0 &&
		     next == 'OP_ENDIF' ) {
		    this.opStack = this.opStack.slice( this.opStack, this.opStack.length + i, -1 * i );
		    break;
		}
		i--;
		next = this.opStack.peak( i );
	    }
	} else if ( op === 'OP_ENDIF' ) {

	} else if ( op === 'OP_VERIFY' ) {
	    
	} else if ( op === 'OP_RETURN' ) {
	    
	}
	    
	// Stack
	else if ( op === 'OP_TOALTSTACK' ) {
	    var input = this.dataStack.pop();
	    this.altStack.push( input );
	} else if ( op === 'OP_FROMALTSTACK' ) {
	    var input = this.altStack.pop();
	    this.dataStack.push( input );
	} else if ( op === 'OP_IFDUP' ) {
	    var top = this.dataStack.peak();

	    if ( top != 0 ) {
		this.dataStack.push( top );
	    }
	} else if ( op === 'OP_DEPTH' ) {
	    this.dataStack.push( this.dataStack.length );
	} else if ( op === 'OP_DROP' ) {
	    this.dataStack.pop();
	} else if ( op === 'OP_DUP' ) {
	    this.dataStack.push( this.dataStack.peak() );
	} else if ( op === 'OP_NIP' ) {
	    var top = this.dataStack.peak();
	    this.dataStack.pop();
	    this.dataStack.pop();
	    this.dataStack.push( top );
	} else if ( op === 'OP_OVER' ) {
	    this.dataStack.push( this.dataStack.peak( -2 ) );
	} else if ( op === 'OP_PICK' ) {
	    var top = this.dataStack.peak();
	    var copy = this.dataStack.peak( -parseInt( top ) )
	    this.dataStack.pop();
	    this.dataStack.push( copy );


	} else {
	    this.dataStack.push( op );
	}	
    },

    hexToFunction: function() {},

    parseInput: function( inputString ) {
	this.opStack = inputString.split( " " ).reverse();
    },

    step: function() {
	this.currentOp = this.opStack.pop();
	
	this.textToFunction( this.currentOp );
    },

    checkStack: function() {
	return "==============\nopStack:\n" + this.opStack.reverse().join( "\n" ) + "\ndataStack:\n" + this.dataStack.reverse().join( "\n" ) + "\naltStack:\n" + this.altStack.reverse().join( "\n" ) + "\n";
    },

    run: function() {
	while ( this.opStack.length > 0 ) {
	    this.step();
	}

	console.log( this.checkStack() );
    },

    badFormatException: function( error ) {
	console.log( "[Interpreter-ERROR]:", error );
    }
}

if ( typeof document === 'undefined' ) {
    module.exports.ScriptInterpreter = ScriptInterpreter;
}