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

  describe('propagation', function() {
     it('testOneWayConstraintFromEqualsWrapsNestedProperties', function() {
        var o = {a: pt(0,0),
                 b: pt(1,1),
                 c: pt(2,2)};

        bbb.always({
            solver: new DBPlanner(),
            ctx: {
                DBPlanner: DBPlanner,
                o: o,
                _$_self: this.doitContext || this
            }
        }, function() {
            return o.a.equals(o.b.addPt(o.c)) && o.b.equals(o.a.subPt(o.c)) && o.c.equals(o.a.subPt(o.b));
        });

        (o.a.equals(o.b.addPt(o.c))).should.be.true();

        o.a = pt(100,100);
        (o.a.equals(o.b.addPt(o.c))).should.be.true();
        (o.a.equals(pt(100,100))).should.be.true();

        // TODO XXX: these require value class updates
        // o.a.x = 12
        // this.assert(o.a.equals(o.b.addPt(o.c)));
        // this.assert(o.a.equals(pt(12,100)));

        // o.b.y = pt(23)
        // this.assert(o.a.equals(o.b.addPt(o.c)));
        // this.assert(o.b.y === 23);

        // TODO(mjendruk): Does not work after migration
        // o.c.x = 18;
        // (o.a.equals(o.b.addPt(o.c))).should.be.true();
        // (o.c.x === 18).should.be.true();
    });

    it('testOneWayConstraintFromEquals', function() {
      var o = {a: pt(0,0),
               b: pt(1,1),
               c: pt(2,2)};

      bbb.always({
        solver: new DBPlanner(),
        ctx: {
          DBPlanner: DBPlanner,
          o: o,
          _$_self: this.doitContext || this
        }
      }, function() {
          return o.a.equals(o.b.addPt(o.c)) && o.b.equals(o.a.subPt(o.c)) && o.c.equals(o.a.subPt(o.b));;
      });

      (o.a.equals(o.b.addPt(o.c))).should.be.true();

      o.a = pt(100,100);
      (o.a.equals(o.b.addPt(o.c))).should.be.true();
      (o.a.equals(pt(100,100))).should.be.true();

      o.b = pt(20,20);
      (o.a.equals(o.b.addPt(o.c))).should.be.true();
      (o.b.equals(pt(20,20))).should.be.true();

      o.c = pt(13,13);
      (o.a.equals(o.b.addPt(o.c))).should.be.true();
      (o.c.equals(pt(13,13))).should.be.true();
    });

    it('testOneWayConstraintFromEq', function() {
      var o = {
        string: "0",
        number: 0
      };

      bbb.always({
        solver: new DBPlanner(),
        ctx: {parseFloat: parseFloat, o: o}
      }, function () {
        return o.string == o.number + "" &&
        o.number == parseFloat(o.string);
      });

      (o.string === o.number + "").should.be.true();
      o.string = "1";
      (o.number === 1).should.be.true();
      var cannotSatisfy;
      o.number = 12;
      (o.number == 12).should.be.true();
      (o.string == "12").should.be.true();
    });

    it('testOnlyOneConstraintIsCreatedWithoutAnd', function() {
      var o = {string: "0",
               number: 0};

      bbb.always({
        solver: new DBPlanner(),
        ctx: {parseFloat: parseFloat, o: o}
      }, function () {
        o.string == o.number + "";
        return o.number == parseFloat(o.string);
      });

      (o.string === o.number + "").should.be.true();
      o.string = "1";
      (o.number === 1).should.be.true();
      var cannotSatisfy;
      o.number = 12;
      (o.number == 1).should.be.true();
      (o.string == 1).should.be.true();
    });

    it('testSimplePropagation', function() {
        var o = {string: "0",
                 number: 0};

        bbb.always({
          solver: new DBPlanner(),
          ctx: {
            o: o
          }, methods: function () {
            o.string.formula([o.number], function (num) { return num + "" });
            o.number.formula([o.string], function (str) { return parseInt(str) });
          }
        }, function () {
          return o.string == o.number + "";
        });

        (o.string === o.number + "").should.be.true();
        o.string = "1";
        (o.number === 1).should.be.true();
        o.number = 12;
        (o.string === "12").should.be.true();
    });

    it('testJustEquality', function() {
      var db = new DBPlanner(),
          obj = {a: pt(0,0), b: pt(1,1)};
      
      bbb.always({
        solver: db,
        ctx: {
          db: db,
          obj: obj,
          _$_self: this.doitContext || this
        }
      }, function() {
        return obj.a == obj.b;
      });

      (obj.a.equals(obj.b)).should.be.true();
      (obj.a !== obj.b).should.be.true();
    });

    it('testJustEquality2', function() {
      var db = new DBPlanner(),
          obj = {a: pt(0,0), b: pt(1,1)};

      bbb.always({
        solver: db,
        ctx: {
          db: db,
          obj: obj,
          _$_self: this.doitContext || this
        }
      }, function() {
        return obj.a.equals(obj.b);
      });

      (obj.a.equals(obj.b)).should.be.true();
      (obj.a !== obj.b).should.be.true();
    });

    // TODO(mjendruk): Does not work after migration
    xit('testAutomaticSetterInference', function() {
      var solver = new DBPlanner(),
          r1 = lively.morphic.Morph.makeRectangle(0,0,100,100),
          r2 = lively.morphic.Morph.makeRectangle(10,10,200,200),
          r1setPositionValue, r2setPositionValue;

      r1.setPosition = r1.setPosition.wrap(function (proceed, value) {
        r1setPositionValue = value;
        return proceed(value);
      })
      r2.setPosition = r2.setPosition.wrap(function (proceed, value) {
        r2setPositionValue = value;
        return proceed(value);
      })

      var c = bbb.always({
        solver: solver,
        ctx: {
          solver: solver,
          r1: r1,
          r2: r2,
          _$_self: this.doitContext || this
        }
      }, function() {
        return r1.getPosition().equals(r2.getPosition());;
      });

      (r1.getPosition().equals(r2.getPosition())).should.be.true();
      r2.setPosition(pt(5,5));
      (r1.getPosition().equals(r2.getPosition())).should.be.true();
      (r1.getPosition().equals(pt(5,5))).should.be.true();
      (r1setPositionValue.equals(pt(5,5))).should.be.true();
      r1.setPosition(pt(100,100));
      (r1.getPosition().equals(r2.getPosition())).should.be.true();
      (r2.getPosition().equals(pt(100,100))).should.be.true();
      (r2setPositionValue.equals(pt(100,100))).should.be.true();
    });

    it('testIdentity', function() {
      var db = new DBPlanner(),
          obj = {a: pt(0,0), b: pt(1,1)};
      
      bbb.always({
        solver: db,
        ctx: {
          db: db,
          obj: obj,
          _$_self: this.doitContext || this
        }
      }, function() {
        return obj.a === obj.b;
      });

      (obj.a === obj.b).should.be.true();
      obj.a = pt(10,10);
      (obj.a === obj.b).should.be.true();
      obj.b = pt(10,10);
    });

    // TODO(mjendruk): Does not work after migration
    xit('testIdentity2', function() {
      var db = new DBPlanner(),
          color = Color.rgb(200,0,0),
          color2 = Color.rgb(0,0,200);

      bbb.always({
        solver: db,
        ctx: {
          db: db,
          color: color,
          color2: color2,
          _$_self: this.doitContext || this
        }
      }, function() {
        return color.equals(color2);
      });

      (color.equals(color2)).should.be.true();
      color.r = 0.1;
      color2.g = 0.7;
      (color.equals(color2)).should.be.true();
      (color2.r === 0.1).should.be.true();
      (color.g === 0.7).should.be.true();
    });

    it('testBoolPropagation', function () {
      var o = {a: true,
               b: 10};

      bbb.always({
        solver: new DBPlanner(),
        ctx: {
          o: o
        }, methods: function () {
          o.a.formula([o.b], function (b, a) { return b > 15 });
          o.b.formula([o.a], function (a, b) { return a ? 16 : 15 });
        }
      }, function () {
        return o.a == (o.b > 15);
      });

      o.a.should.be.equal(false, "deltablue changed a");
      o.b = 20;
      o.a.should.be.equal(true, "deltablue changed a");
      o.a = false;
      o.b.should.be.exactly(15, "deltablue changed b");
      o.b = 20;
      o.a.should.be.equal(true, "deltablue changed a");
      o.a = true;
      o.b.should.be.exactly(20, "deltablue didn't change b, because the predicate was satisfied");
    });

    it('testArithmetic', function() {
      var o = {x: 0, y: 0, z: 0};

      bbb.always({
        solver: new DBPlanner(),
        ctx: {
          o: o
        }, methods: function () {
          o.x.formula([o.y, o.z], function (y, z) { debugger; return z - y });
          o.y.formula([o.x, o.z], function (x, z) { debugger; return z - x });
          o.z.formula([o.x, o.y], function (x, y) { debugger; return x + y });
        }
      }, function () {
        return o.x + o.y == o.z;
      });

      (o.x + o.y == o.z).should.be.true();
      o.x = 10;
      (o.x == 10).should.be.true();
      (o.x + o.y == o.z).should.be.true();
      o.y = 15;
      (o.y == 15).should.be.true();
      (o.x + o.y == o.z).should.be.true();
      o.z = 100;
      (o.z == 100).should.be.true();
      (o.x + o.y == o.z).should.be.true();
    });

    it('testDeltaBlueUserFunction', function() {
        var planner = new DBPlanner(),
            string = new DBVariable("string", "0", planner),
            number = new DBVariable("number", 0, planner);

        var constraint = new UserDBConstraint(function (c) {
          c.formula(string, [number], function (num) { return num + ""; });
          c.formula(number, [string], function (str) { return parseInt(str); });
        }, planner);
        constraint.addDBConstraint();

        number.assignValue(10);
        number.value.should.be.exactly(10, "new value should stick");
        string.value.should.be.exactly("10", "new value should propagate");

        string.assignValue("12");
        number.value.should.be.exactly(12, "new value should propagate");
        string.value.should.be.exactly("12", "new value should stick");
    });

    it('testNoPredicate', function () {
        var db = new DBPlanner(),
            element = {color: "red", celsius: 50};

        bbb.always({solver: db, ctx: {e: element}}, function() {
          e.color.formula([e.celsius],
            function(c) {
              return c > 50 ? "red" : "blue";
            });
          }
        );

        element.color.should.be.exactly("blue", "should have changed to blue");
        element.celsius.should.be.exactly(50);

        element.celsius = 70;
        element.color.should.be.exactly("red", "should have changed to red");
        element.celsius.should.be.exactly(70);

        element.celsius = 30;
        element.color.should.be.exactly("blue", "should have changed to blue");
        element.celsius.should.be.exactly(30);
    });
  });

  // TODO(mjendruk): Was already deactivated before migration
  describe('on error', function() {
    xit('DeltaBlueConstraintConstruction', function () {
      var obj = {int: 17, str: "17"},
          onErrorCalled = false;

      bbb.defaultSolver = new DBPlanner();

      bbb.always({
        onError: function() {
          onErrorCalled = true;
        },
        ctx: {
          obj: obj
        }, methods: function() {
          obj.int.formula([obj.str], function (str) { return parseInt(str); });
          obj.str.formula([obj.int], function (int) { return int + ""; })
        }
      }, function () {
        return obj.int + "" === obj.str;
      });

      bbb.always({
        onError: function() {
          onErrorCalled = true;
        },
        ctx: {
          obj: obj
        }, methods: function() {
          obj.int.formula([obj.str], function (str) { return parseInt(str)-1; });
          obj.str.formula([obj.int], function (int) { return (int+1) + ""; })
        }
      }, function () {
        return (obj.int+1) + "" === obj.str;
      });

      obj.str = "10";

      onErrorCalled.should.be.equal(true, "onError was not called; obj.a: " + obj.a);
    });
  });
});
