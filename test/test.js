var should = require("should")
var bbb = require("babelsbergjs-core");
var bbb_deltablue = require("../deltablue_ext.js");

var DBPlanner = bbb_deltablue.DBPlanner;

require('./test_harness')
console.log = require('./filtered_log')

function prepared_always(ctx, callback) {
  ctx = ctx || {};
  ctx.solver = new DBPlanner();
  return bbb.always({
    solver: ctx.solver,
    ctx: ctx
  }, callback);
}

describe('bbb_deltablue', function() {
  describe('properties', function() {
    it('contain DBOrderedCollection.', function() {
      bbb_deltablue.should.have.property('DBOrderedCollection')
        .which.is.a.DBOrderedCollection;
    }); 

    it('contain DBStrength.', function() {
      bbb_deltablue.should.have.property('DBStrength')
        .which.is.a.DBStrength;
    }); 

    it('contain DBConstraint.', function() {
      bbb_deltablue.should.have.property('DBConstraint')
        .which.is.a.DBConstraint;
    }); 

    it('contain DBVariable.', function() {
      bbb_deltablue.should.have.property('DBVariable')
        .which.is.a.DBVariable;
    }); 

    it('contain DBPlanner.', function() {
      bbb_deltablue.should.have.property('DBPlanner')
        .which.is.a.DBPlanner;
    }); 

    it('contain DBPlan.', function() {
      bbb_deltablue.should.have.property('DBPlan')
        .which.is.a.DBPlan;
    }); 
  });


  // describe('constraints', function() {
  //   it('solves variable b to stay smaller than a.', function() {
  //     obj = {a: 1, b: 2};
  //     prepared_always({obj: obj}, function () {
  //       return obj.a + 7 <= obj.b;
  //     });
  //     obj.a = 10;
  //     (obj.a + 7).should.not.be.greaterThan(obj.b);
  //   });

  //   it('keeps sum of variables constant.', function() {
  //     var obj = {a: 2, b: 3};
  //     prepared_always({obj: obj}, function () {
  //       return obj.a + obj.b == 3;
  //     });
  //     (obj.a + obj.b).should.be.exactly(3);
  //   });


  //   it('disables constraints temporarily.', function() {
  //     var obj = {a: 8};
  //     var c = prepared_always({obj: obj}, function () {
  //         return obj.a >= 100;
  //     });
  //     obj.a = 110;
  //     (function(){
  //       obj.a = 90
  //     }).should.throw(/^\(ExCLRequiredFailure\).*/);
  //     c.disable();
  //     obj.a = 90;
  //     obj.a.should.be.exactly(90);
  //     c.enable();
  //     obj.a.should.be.exactly(100);
  //     (function(){
  //         obj.a = 90;
  //     }).should.throw(/^\(ExCLRequiredFailure\).*/);
  //   });

  //   it('keeps inequality.', function() {
  //     var obj = {a: 8};
  //     prepared_always({obj: obj}, function () {
  //       return obj.a >= 100;
  //     });
  //     obj.a.should.not.be.lessThan(100);
  //     obj.a = 110;
  //     obj.a.should.be.exactly(110);
  //   });

  //   it('handles simple paths.', function() {
  //     ClSimplexSolver.resetInstance();
  //     var pointA = pt(1, 2),
  //         pointB = pt(2, 3),
  //         o = {a: pointA, b: pointB};
  //     prepared_always({o: o}, function () {
  //       return o.a.x + 100 <= o.b.x;
  //     });
  //     (pointA.x + 100).should.not.be.greaterThan(pointB.x);
  //   });

  //   it('invalidates simple paths.', function() {
  //     var pointA = pt(1, 2),
  //         pointB = pt(2, 3),
  //         o = {a: pointA, b: pointB};
  //     prepared_always({o: o}, function() {
  //         return o.a.x + 100 <= o.b.x;
  //     });
  //     pointA = pt(12, 12);
  //     o.a = pointA;
  //     (pointA.x + 100).should.not.be.greaterThan(pointB.x);
  //   });

  //   it('solves temperature conversion problem.', function() {
  //     var obj = {fahrenheit: 212, centigrade: 100};
  //     prepared_always({ obj: obj}, function() {
  //         return obj.fahrenheit - 32 == obj.centigrade * 1.8;
  //     });

  //     (obj.fahrenheit - 32).should.be.approximately(obj.centigrade * 1.8, 0.1);
  //     obj.fahrenheit = 100;
  //     (obj.fahrenheit - 32).should.be.approximately(obj.centigrade * 1.8, 0.1);
  //     obj.centigrade = 121;
  //     (obj.fahrenheit - 32).should.be.approximately(obj.centigrade * 1.8, 0.1);
  //   });


  //   it('handles undefined variables.', function() {
  //     var obj = {};
  //     return bbb.always({
  //       allowTests: true,
  //       solver: new ClSimplexSolver(),
  //       ctx: { obj: obj}
  //     }, function() {
  //         return obj.a + obj.b == obj.c;
  //     });
  //   });

  //   it('can handle string constraints.', function() {
  //       var a = pt(0,0),
  //           b = "hello"
  //       prepared_always({
  //         a: a,
  //         ro: bbb.readonly,
  //         b: b,
  //         _$_self: this.doitContext || this
  //       }, function() {
  //         return a.x == ro(b.length);
  //       });
  //       a.x.should.be.exactly("hello".length);
  //   });

  //   //TODO(fhorschig|parnswir|mjendruk): Enable and fix. (Remove x)
  //   xit('recalculates for text input.', function() {
  //     var obj = {
  //           txt: new lively.morphic.Text(),
  //           a: 10
  //         };
  //     obj.txt.setTextString("5");

  //     prepared_always({obj: obj}, function() {
  //       return obj.a == obj.txt.getTextString();
  //     });
  //     (obj.a == obj.txt.getTextString()).should.be.true();

  //     obj.txt.setTextString("15");
  //     (obj.a == obj.txt.getTextString()).should.be.true();
  //     (obj.a === 15).should.be.true();
  //   });

  //   it('solves simple assignment while keeping assigned value.', function() {
  //     var obj = {a: 2, b: 3};
  //     prepared_always({obj: obj}, function() {
  //         return obj.a + obj.b == 3;
  //     });
  //     (obj.a + obj.b).should.equal(3);
  //     obj.a = -5;
  //     (obj.a + obj.b).should.equal(3);
  //     obj.a.should.equal(-5);
  //   });

  //   //TODO(fhorschig|parnswir|mjendruk): Enable and fix. (Remove x)
  //   xit('handles equality of complex objects.', function() {
  //     var point = pt();
  //     prepared_always({
  //       point: point,
  //       pt: pt,
  //       _$_self: this.doitContext || this
  //     }, function() {
  //       return point.equals(pt(10, 10).addPt(pt(11, 11)));;
  //     });
  //     point.equals(pt(21, 21)).should.be.true();
  //     (function() {
  //         point.x = 100;
  //     }).should.throw(/.*/);  // TODO(fhorschig): Refine.
  //     point.equals(pt(21, 21)).should.be.true();
  //   });

  //   //TODO(fhorschig|parnswir|mjendruk): Enable and fix. (Remove x)
  //   xit('maintains equality of Points.', function() {
  //     var pt1 = pt(10, 10),
  //         pt2 = pt(20, 20);
  //     prepared_always({
  //         pt1: pt1,
  //         pt2: pt2
  //     }, function() {
  //       return pt1.equals(pt2);
  //     });
  //     pt1.equals(pt2).should.be.true();
  //   });

  //   //TODO(fhorschig|parnswir|mjendruk): Enable and fix. (Remove x)
  //   xit('handles addition of Points.', function() {
  //     var pt1 = pt(10, 10),
  //         pt2 = pt(20, 20),
  //         pt3 = pt(0, 0);
  //     prepared_always({
  //       pt1: pt1,
  //       pt2: pt2,
  //       pt3: pt3
  //     }, function() {
  //       return pt1.addPt(pt2).equals(pt3);
  //     });

  //     pt1.addPt(pt2).equals(pt3).should.be.true();
  //   });

  //   it('solves after assignments of Points.', function() {
  //     var obj = {p: pt(10, 10)};
  //     prepared_always({obj: obj}, function() {
  //       return obj.p.x >= 100 && obj.p.y >= 100;
  //     });

  //     pt(100, 100).leqPt(obj.p).should.be.true();

  //     obj.p.x = 150;
  //     pt(100, 100).leqPt(obj.p).should.be.true();
  //     (obj.p.x === 150).should.be.true();

  //     obj.p = pt(150, 100);
  //     pt(100, 100).leqPt(obj.p).should.be.true();
  //     (obj.p.x === 150).should.be.true();
  //   });

  //   //TODO(fhorschig|parnswir|mjendruk): Enable and fix. (Remove x)
  //   xit('testLivelyPtIsValueClass.', function() {
  //     var m = lively.morphic.Morph.makeCircle(pt(1,1), 10);

  //     var old = m.getPosition();
  //     m.setPosition(pt(100,100));
  //     (old !== m.getPosition()).should.be.true();

  //     prepared_always({
  //       m: m,
  //       pt: pt,
  //       _$_self: this.doitContext || this
  //     }, function() {
  //       return m.getPosition().leqPt(pt(21, 21));;
  //     });

  //     m.getPosition().equals(pt(21,21)).should.be.true();
  //     var old = m.getPosition();
  //     m.setPosition(pt(10,10));
  //     m.getPosition().equals(pt(10,10)).should.be.true();
  //     (old === m.getPosition()).should.be.true();
  //   });

  //   //TODO(fhorschig|parnswir|mjendruk): Enable and fix. (Remove x)
  //   xit('handles complex assignments.', function() {
  //     var obj = {p: pt(10, 10), p2: pt(20, 20)};
  //     prepared_always({obj: obj}, function() {
  //       return (obj.p.equals(obj.p2) &&
  //               obj.p.x >= 100 &&
  //               obj.p.y >= 100);
  //     });

  //     pt(100, 100).leqPt(obj.p).should.be.true();
  //     obj.p.equals(obj.p2).should.be.true();

  //     obj.p.x = 150;
  //     pt(100, 100).leqPt(obj.p).should.be.true();
  //     (obj.p.x === 150).should.be.true();
  //     obj.p.equals(obj.p2).should.be.true();

  //     obj.p = pt(150, 100);
  //     obj.p.equals(obj.p2).should.be.true();
  //     obj.p.equals(pt(150, 100)).should.be.true();

  //     obj.p2 = pt(200, 200);
  //     obj.p.equals(obj.p2).should.be.true();
  //     obj.p.equals(pt(200, 200)).should.be.true();
  //   });

  //   //TODO(fhorschig|parnswir|mjendruk): Enable and fix. (Remove x)
  //   xit('handles assignments of complex objects with scales.', function() {
  //     var obj = {p: pt(10, 10), p2: pt(20, 20)};
  //     prepared_always({obj: obj}, function() {
  //       return (obj.p.equals(obj.p2.scaleBy(2)) &&
  //               obj.p.x >= 100 &&
  //               obj.p.y >= 100);
  //     });

  //     pt(100, 100).leqPt(obj.p).should.be.true();
  //     obj.p.equals(obj.p2.scaleBy(2)).should.be.true();

  //     obj.p.x = 150;
  //     pt(100, 100).leqPt(obj.p).should.be.true();
  //     (obj.p.x === 150).should.be.true();
  //     obj.p.equals(obj.p2.scaleBy(2)).should.be.true();

  //     obj.p = pt(150, 100);
  //     obj.p.equals(obj.p2.scaleBy(2)).should.be.true();
  //     obj.p.equals(pt(150, 100)).should.be.true();

  //     obj.p2 = pt(200, 200);
  //     obj.p.equals(obj.p2.scaleBy(2)).should.be.true();
  //     obj.p2.equals(pt(200, 200)).should.be.true();

  //     // Note(fhorschig): WTF? why is there a try? Can we use should.throw?
  //     try {
  //         obj.p2 = pt(15, 15);
  //     } catch(_) {
  //         obj.p.equals(obj.p2.scaleBy(2)).should.be.true();
  //         obj.p2.equals(pt(200, 200)).should.be.true();
  //     }
  //     obj.p2.equals(pt(200, 200)).should.be.true();
  //     obj.p2 = pt(50, 50);
  //     obj.p.equals(obj.p2.scaleBy(2)).should.be.true();
  //     obj.p2.equals(pt(50, 50)).should.be.true();
  //   });

  //   it('enforces readonly constraints on left side.', function() {
  //     var obj = {
  //           a: 10,
  //           b: 0
  //         };
  //     prepared_always({
  //       obj: obj,
  //       r: bbb.readonly
  //     }, function() {
  //       return r(obj.a) == obj.b;
  //     });
  //     obj.a.should.be.exactly(10);
  //     obj.b.should.be.exactly(10);
  //   });

  //   it('enforces readonly constraints on right side.', function() {
  //     var obj = {
  //           a: 10,
  //           b: 0
  //         };
  //     prepared_always({
  //       obj: obj,
  //       r: bbb.readonly
  //     }, function() {
  //       return obj.a == r(obj.b);
  //     });
  //     obj.a.should.be.exactly(0);
  //     obj.b.should.be.exactly(0);
  //   });

  //   it('fails for readonly constraints on both sides.', function() {
  //     var obj = {
  //           a: 10,
  //           b: 0
  //         };
  //     (function() {
  //       prepared_always({
  //         obj: obj,
  //         r: bbb.readonly
  //       }, function() {
  //         return r(obj3.a) == r(obj3.b);
  //       });
  //     }).should.throw();  //TODO(fhorschig): Correct error message, not any.
  //   });

  //   it('enforces readonly on items.', function() {
  //     var i = {
  //           time: 1,
  //           value: 2,
  //           sum: 0
  //         },
  //         i2 = {
  //           time: 2,
  //           value: 3,
  //           sum: 0
  //         },
  //         solver = new ClSimplexSolver();
  //     solver.setAutosolve(false);
  //     bbb.always({solver: solver, ctx: {i: i}}, function () {
  //       return i.sum >= 0;
  //     });
  //     bbb.always({solver: solver, ctx: {i: i2}}, function () {
  //       return i.sum >= 0;
  //     });

  //     bbb.always({solver: solver, ctx: {i: i, r: bbb.readonly}}, function () {
  //       if (i.prev) {
  //         return i.sum == r(i.value) + i.prev.sum;
  //       } else {
  //         return i.sum == r(i.value);
  //       }
  //     });
  //     bbb.always({solver: solver, ctx: {i: i2, r: bbb.readonly}}, function () {
  //       if (i.prev) {
  //         return i.sum == r(i.value) + i.prev.sum;
  //       } else {
  //         return i.sum == r(i.value);
  //       }
  //     });
  //     i.sum.should.be.exactly(2);
  //     i2.sum.should.be.exactly(3);
  //     i2.prev = i;
  //     i.sum.should.be.exactly(2);
  //     i2.sum.should.be.exactly(5);
  //     i2.prev = {sum: 100}
  //     i2.sum.should.be.exactly(103);
  //   });

  //   //TODO(fhorschig|parnswir|mjendruk): Enable and fix. (Remove x)
  //   xit('enforces readonly within objects.', function() {
  //     var pt1 = lively.pt(0, 0),
  //         pt2 = lively.pt(10, 10);

  //     prepared_always({
  //       pt1: pt1,
  //       pt2: pt2,
  //       ro: bbb.readonly,
  //       _$_self: this.doitContext || this
  //     }, function() {
  //       return pt1.equals(ro(pt2));
  //     });

  //     pt1.equals(pt(10,10)).should.be.true()
  //     pt2.equals(pt(10,10)).should.be.true()
  //     (function() {
  //       pt1.x = 5;
  //     }).should.throw();  //TODO(fhorschig): Correct error message, not any.
  //     pt1.equals(pt(10,10)).should.be.true();
  //     pt2.equals(pt(10,10)).should.be.true();
  //   });

  //   it('testConjunction', function() {
  //     var ctx = {a: 10, b: 100, c: 1000, d: 10000},
  //         constraint = prepared_always({ctx: ctx}, function() {
  //           return ctx.a == ctx.b && ctx.c == ctx.d;
  //         });

  //     ctx.a.should.equal(ctx.b);
  //     ctx.c.should.equal(ctx.d);
  //     constraint.constraintobjects.length.should.be.exactly(2);
  //   });
  // });


  // describe('propagation', function() {
  //   //TODO(fhorschig|parnswir|mjendruk): Enable and fix. (Remove x)
  //   xit('automatically inferes setter.', function() {
  //     var r1 = lively.morphic.Morph.makeRectangle(0,0,100,100),
  //         r2 = lively.morphic.Morph.makeRectangle(10,10,200,200),
  //         r1setPositionValue, r2setPositionValue,
  //         r1setPositionCalls = 0, r2setPositionCalls = 0;

  //     r1.setPosition = r1.setPosition.wrap(function (proceed, value) {
  //       r1setPositionCalls++;
  //       r1setPositionValue = value;
  //       return proceed(value);
  //     });

  //     r2.setPosition = r2.setPosition.wrap(function (proceed, value) {
  //       r2setPositionCalls++;
  //       r2setPositionValue = value;
  //       return proceed(value);
  //     });

  //     prepared_always({
  //       r1: r1,
  //       r2: r2,
  //       _$_self: this.doitContext || this
  //     }, function() {
  //       return r1.getPosition().equals(r2.getPosition());
  //     });

  //     r1.getPosition().equals(r2.getPosition()).should.be.true();

  //     r2.setPosition(pt(5,5));

  //     r1.getPosition().equals(r2.getPosition()).should.be.true();
  //     r1.getPosition().equals(pt(5,5)).should.be.true();
  //     r1.setPositionValue.equals(pt(5,5)).should.be.true();
  //     r1.setPositionCalls.should.be.exactly(2); // call each setter just once per
  //     r2.setPositionCalls.should.be.exactly(2); // once above
  //   });
  // });


  // describe('interaction', function() {
  //   //TODO(fhorschig|parnswir|mjendruk): Enable and fix. (Remove x)
  //   xit('handles dynamic regions on points.', function() {
  //     var c = new ClSimplexSolver(),
  //         c2 = new ClSimplexSolver();
  //     var e1 = lively.morphic.Morph.makeCircle(pt(0,0), 10),
  //         e2 = lively.morphic.Morph.makeCircle(pt(0,0), 10),
  //         e3 = lively.morphic.Morph.makeCircle(pt(20,20), 10),
  //         e4 = lively.morphic.Morph.makeCircle(pt(20,20), 10);

  //     bbb.always({
  //       solver: c,
  //       ctx: {
  //         c: c,
  //         e2: e2,
  //         e1: e1,
  //         e3: e3,
  //         _$_self: this.doitContext || this
  //       }
  //     }, function() {
  //         return e2.getPosition().equals(e1.getPosition().addPt(e3.getPosition()).scaleBy(.5));;
  //     });

  //     e1.getPosition().equals(pt(0,0)).should.be.true();
  //     e2.getPosition().equals(pt(10,10)).should.be.true();
  //     e3.getPosition().equals(pt(20,20)).should.be.true();

  //     e1.setPosition(pt(5,5));
  //     e1.getPosition().equals(pt(5,5)).should.be.true();
  //     e2.getPosition().equals(pt(12.5,12.5)).should.be.true();
  //     e3.getPosition().equals(pt(20,20)).should.be.true();

  //     bbb.always({
  //       solver: c2,
  //       ctx: {
  //           e1: e1,
  //           e4: e4,
  //           _$_self: this.doitContext || this
  //       }
  //     }, function() {
  //       return e1.getPosition().equals(e4.getPosition());;
  //     });

  //     e1.getPosition().equals(pt(5,5)).should.be.true();
  //     e2.getPosition().equals(pt(12.5,12.5)).should.be.true();
  //     e3.getPosition().equals(pt(20,20)).should.be.true();
  //     e4.getPosition().equals(pt(5,5)).should.be.true();

  //     e4.setPosition(pt(5,5));
  //     e1.getPosition().equals(pt(5,5)).should.be.true();
  //     e2.getPosition().equals(pt(12.5,12.5)).should.be.true();
  //     e3.getPosition().equals(pt(20,20)).should.be.true();
  //     e4.getPosition().equals(pt(5,5)).should.be.true();

  //     e1.setPosition(pt(0,0));
  //     e1.getPosition().equals(pt(0,0)).should.be.true();
  //     e2.getPosition().equals(pt(10,10)).should.be.true();
  //     e3.getPosition().equals(pt(20,20)).should.be.true();
  //     e4.getPosition().equals(pt(0,0)).should.be.true();
  //   });

  //   it('lets two solvers interact. (First constant)', function () {
  //     var pt = {x: 15, y: 2},
  //         s1 = new ClSimplexSolver(),
  //         s2 = new ClSimplexSolver();
  //     s1.weight = 100;
  //     s2.weight = 200;

  //     bbb.always({
  //       solver: s2,
  //       ctx: {pt: pt}
  //     }, function() {
  //       return pt.y == 2;;
  //     });
  //     pt.y.should.be.exactly(2);

  //     bbb.always({
  //       solver: s1,
  //       ctx: {pt: pt}
  //     }, function() {
  //       return pt.y == pt.x;;
  //     });

  //     pt.x.should.equal(pt.y);
  //     pt.y.should.be.exactly(2);
  //   });

  //   it('lets two solvers interact. (Second constant)', function () {
  //     var pt = {x: 15, y: 2},
  //         s1 = new ClSimplexSolver(),
  //         s2 = new ClSimplexSolver();
  //     s1.weight = 100;
  //     s2.weight = 200;

  //     bbb.always({
  //       solver: s1,
  //       ctx: {pt: pt}
  //     }, function() {
  //       return pt.y == pt.x;;
  //     });
  //     pt.x.should.equal(pt.y);

  //     bbb.always({
  //       solver: s2,
  //       ctx: {pt: pt}
  //     }, function() {
  //       return pt.y == 2;;
  //     });
  //     pt.x.should.equal(pt.y);
  //     pt.y.should.be.exactly(2);
  //   });
  // });


  // describe('Error callbacks', function() {
  //   it('calls error callback on constraint construction.', function () {
  //     var obj = {a: 0},
  //         onErrorCalled = false;

  //     bbb.defaultSolver = new ClSimplexSolver();
  //     bbb.always({
  //       onError: function() {
  //         onErrorCalled = true;
  //       },
  //       ctx: {
  //         bbb: bbb,
  //         obj: obj,
  //         _$_self: this.doitContext || this
  //       }
  //     }, function() {
  //       return obj.a == 0;;
  //     });

  //     bbb.always({
  //       onError: function() {
  //         onErrorCalled = true;
  //       },
  //       ctx: {
  //         bbb: bbb,
  //         obj: obj,
  //         _$_self: this.doitContext || this
  //       }
  //     }, function() {
  //       return obj.a == 10;;
  //     });

  //     onErrorCalled.should.be.true();
  //   });

  //   it('calls error callback on assignment.', function () {
  //     var obj = {a: 0},
  //         onErrorCalled = false;

  //     bbb.defaultSolver = new ClSimplexSolver();
  //     bbb.always({
  //       onError: function() {
  //         onErrorCalled = true;
  //       },
  //       ctx: {
  //         bbb: bbb,
  //         obj: obj,
  //         _$_self: this.doitContext || this
  //       }
  //     }, function() {
  //       return obj.a == 0;;
  //     });

  //     obj.a = 10;

  //     onErrorCalled.should.be.true();
  //   });
  // });
});
