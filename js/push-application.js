// Generated by CoffeeScript 1.3.1
(function() {
  var Character, CharacterList, Cube, CubeController, CubeOfCubes, Transition, TransitionGroup, TransitionManager,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Character = (function() {

    Character.name = 'Character';

    Character.currentIndex = 0;

    function Character(str, probability, index) {
      this.str = str.toLowerCase();
      this.probability = probability;
      this.index = Character.currentIndex;
      Character.currentIndex += 1;
    }

    return Character;

  })();

  CharacterList = (function() {

    CharacterList.name = 'CharacterList';

    function CharacterList() {
      this.chars = [];
      this.chars.push(new Character("a", 0.0651));
      this.chars.push(new Character("b", 0.0189));
      this.chars.push(new Character("c", 0.0306));
      this.chars.push(new Character("d", 0.0508));
      this.chars.push(new Character("e", 0.1740));
      this.chars.push(new Character("f", 0.0166));
      this.chars.push(new Character("g", 0.0301));
      this.chars.push(new Character("h", 0.0476));
      this.chars.push(new Character("i", 0.0755));
      this.chars.push(new Character("j", 0.0027));
      this.chars.push(new Character("k", 0.0121));
      this.chars.push(new Character("l", 0.0344));
      this.chars.push(new Character("m", 0.0253));
      this.chars.push(new Character("n", 0.0978));
      this.chars.push(new Character("o", 0.0251));
      this.chars.push(new Character("p", 0.0079));
      this.chars.push(new Character("q", 0.0002));
      this.chars.push(new Character("r", 0.0700));
      this.chars.push(new Character("s", 0.0727));
      this.chars.push(new Character("ß", 0.0031));
      this.chars.push(new Character("t", 0.0615));
      this.chars.push(new Character("u", 0.0435));
      this.chars.push(new Character("v", 0.0067));
      this.chars.push(new Character("w", 0.0189));
      this.chars.push(new Character("x", 0.0003));
      this.chars.push(new Character("y", 0.0004));
      this.chars.push(new Character("z", 0.0113));
    }

    CharacterList.prototype.getCharacter = function(inputString) {
      var char;
      char = this.chars.filter(function(c) {
        if (c.str === inputString.toLowerCase()) {
          return c;
        }
      });
      return char;
    };

    CharacterList.prototype.maxProbability = function() {
      var max,
        _this = this;
      max = this.chars[0];
      _(this.chars).each(function(item) {
        if (item.probability > max.probability) {
          return max = item;
        }
      });
      return max.probability;
    };

    return CharacterList;

  })();

  CubeController = (function() {

    CubeController.name = 'CubeController';

    function CubeController(cube) {
      this.next = __bind(this.next, this);
      this.cube = cube;
      this.currentSide = 0;
      this.chars = new CharacterList();
      this.maxProbability = this.chars.maxProbability();
      this.charCount = 0;
      this.queue = '';
      this.pos = 0;
    }

    CubeController.prototype.setString = function(str) {
      if (!(this.pos < this.queue.length)) {
        this.pos = 0;
        if (this.queue.length !== 0) {
          while (str.charAt(this.pos) === this.queue.charAt(this.pos)) {
            if (this.queue.charAt(this.pos) === '' || str.charAt(this.pos) === '') {
              break;
            }
            this.pos += 1;
          }
        }
      }
      this.queue = str;
      if (TransitionManager.isIdle) {
        return this.next();
      }
    };

    CubeController.prototype.next = function() {
      if (this.pos < this.queue.length) {
        this.pushCharacter(this.queue.charAt(this.pos));
        return this.pos += 1;
      }
    };

    CubeController.prototype.pushCharacter = function(char) {
      var after, args, before, c, direction, frequency, i, transitions, _i;
      c = this.chars.getCharacter(char)[0];
      if (c == null) {
        c = this.chars.getCharacter('e')[0];
      }
      frequency = this.cube.numberOfRows - Math.floor(Math.sqrt(c.probability) / Math.sqrt(this.maxProbability) * (this.cube.numberOfRows - 1));
      direction = (this.charCount % 2) * 2 - 1;
      before = 2;
      if (this.currentSide !== 0) {
        before = this.currentSide - 1;
      }
      after = 0;
      if (this.currentSide !== 2) {
        after = this.currentSide + 1;
      }
      transitions = [];
      for (i = _i = 0; 0 <= frequency ? _i < frequency : _i > frequency; i = 0 <= frequency ? ++_i : --_i) {
        args = [0, 0, 0];
        args[this.currentSide] = null;
        args[before] = i;
        args[after] = c.index % this.cube.numberOfRows;
        transitions.push(this.cube.pushRow(args[0], args[1], args[2], direction));
      }
      TransitionManager.add(new TransitionGroup(transitions, this.next));
      this.currentSide += 1;
      if (this.currentSide === 3) {
        this.currentSide = 0;
      }
      return this.charCount++;
    };

    return CubeController;

  })();

  CubeOfCubes = (function() {

    CubeOfCubes.name = 'CubeOfCubes';

    function CubeOfCubes(numberOfRows, cubeSize, spacing, callback) {
      var _i, _ref, _results,
        _this = this;
      this.numberOfRows = numberOfRows;
      this.cubeSize = cubeSize != null ? cubeSize : 100;
      this.spacing = spacing != null ? spacing : 30;
      this.callback = callback;
      this.obj = new THREE.Object3D;
      this.counter = 0;
      this.duration = 10;
      this.cubes = (function() {
        _results = [];
        for (var _i = 1, _ref = this.numberOfRows; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(row, x) {
        var _i, _ref, _results;
        return (function() {
          _results = [];
          for (var _i = 1, _ref = _this.numberOfRows; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this).map(function(col, y) {
          var _i, _ref, _results;
          return (function() {
            _results = [];
            for (var _i = 1, _ref = _this.numberOfRows; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this).map(function(item, z) {
            var cube, nx, ny, nz;
            nx = x - 1;
            ny = y - 1;
            nz = z - 1;
            cube = new Cube(_this.cubeSize, x + y + z);
            cube.id.x = x;
            cube.id.y = y;
            cube.id.z = z;
            cube.castShadow = true;
            cube.receiveShadow = true;
            cube.mesh.position.x = (_this.cubeSize + _this.spacing) * -_this.numberOfRows / 2 + (_this.cubeSize + _this.spacing) * nx;
            cube.mesh.position.y = (_this.cubeSize + _this.spacing) * -_this.numberOfRows / 2 + (_this.cubeSize + _this.spacing) * ny;
            cube.mesh.position.z = (_this.cubeSize + _this.spacing) * +_this.numberOfRows / 2 + (_this.cubeSize + _this.spacing) * nz;
            _this.obj.add(cube.mesh);
            return cube;
          });
        });
      });
      this.obj.position.x = ((this.cubeSize + this.spacing) * numberOfRows) / 2;
      this.obj.position.y = ((this.cubeSize + this.spacing) * numberOfRows) / 2;
      this.obj.position.z = ((this.cubeSize + this.spacing) * numberOfRows) / -2;
    }

    CubeOfCubes.prototype.updatePositions = function() {
      this.counter += 1;
      return TransitionManager.update();
    };

    /*	if @counter % @duration == 0
    			rand = Math.random()
    			this.pushRow( 
    				if rand > 0.33 then Math.round( Math.random()*@numberOfRows+1 )-1 else -1,
    				if rand < 0.66 then Math.round( Math.random()*@numberOfRows+1 )-1 else -1,
    				if rand < 0.33 or rand > 0.66 then Math.round( Math.random()*@numberOfRows+1 )-1 else -1
    			)
    */


    CubeOfCubes.prototype.pushRandom = function() {
      var rand;
      rand = Math.random();
      return this.pushRow(rand > 0.33 ? Math.floor(Math.random() * this.numberOfRows) : null, rand < 0.66 ? Math.floor(Math.random() * this.numberOfRows) : null, rand < 0.33 || rand > 0.66 ? Math.floor(Math.random() * this.numberOfRows) : null);
    };

    CubeOfCubes.prototype.pushRow = function(x, y, z, factor) {
      var flat, transitions,
        _this = this;
      if (factor == null) {
        factor = 0;
      }
      flat = _.flatten(this.cubes);
      if (factor === 0) {
        factor = 1 - Math.round(Math.random()) * 2;
      }
      transitions = [];
      _.each(flat, function(cube, index) {
        if ((x != null) && (y != null)) {
          if (cube.id.x === x && cube.id.y === y) {
            cube.id.z += factor;
            transitions.push(new Transition(cube.mesh.position, 'z', cube.mesh.position.z + (_this.cubeSize + _this.spacing) * factor, _this.duration, null));
          }
        }
        if ((x != null) && (z != null)) {
          if (cube.id.x === x && cube.id.z === z) {
            cube.id.y += factor;
            transitions.push(new Transition(cube.mesh.position, 'y', cube.mesh.position.y + (_this.cubeSize + _this.spacing) * factor, _this.duration, null));
          }
        }
        if ((y != null) && (z != null)) {
          if (cube.id.y === y && cube.id.z === z) {
            cube.id.x += factor;
            return transitions.push(new Transition(cube.mesh.position, 'x', cube.mesh.position.x + (_this.cubeSize + _this.spacing) * factor, _this.duration, null));
          }
        }
      });
      return transitions;
    };

    CubeOfCubes.prototype.addToScene = function(scene) {
      return scene.add(this.obj);
    };

    return CubeOfCubes;

  })();

  Cube = (function() {

    Cube.name = 'Cube';

    function Cube(size, count) {
      this.size = size;
      if (count == null) {
        count = 0;
      }
      this.id = {
        x: 0,
        y: 0,
        z: 0
      };
      this.geometry = new THREE.CubeGeometry(this.size, this.size, this.size);
      if (count % 4 === 0) {
        this.material = new THREE.MeshLambertMaterial({
          color: 0xcc0066,
          opacity: 0.8,
          shading: THREE.FlatShading,
          overdraw: true
        });
      } else {
        this.material = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          opacity: 0.8,
          shading: THREE.FlatShading,
          overdraw: true
        });
      }
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
    }

    Cube.prototype.addToScene = function(scene) {
      return scene.add(this.mesh);
    };

    return Cube;

  })();

  Transition = (function() {

    Transition.name = 'Transition';

    function Transition(object, property, target, duration, callback) {
      this.object = object;
      this.property = property;
      this.target = target;
      this.duration = duration;
      this.callback = callback;
      this.begin = this.object[this.property];
      this.count = 0;
    }

    Transition.prototype.iterate = function() {
      var percentage;
      this.count += 1;
      percentage = this.count / this.duration;
      this.object[this.property] = this.begin + (this.target - this.begin) * percentage;
      if (this.count === this.duration) {
        return this.finished();
      }
    };

    Transition.prototype.finished = function() {
      if (this.group != null) {
        return this.group.remove(this);
      } else {
        return TransitionManager.remove(this);
      }
    };

    return Transition;

  })();

  TransitionGroup = (function() {

    TransitionGroup.name = 'TransitionGroup';

    function TransitionGroup(objects, callback) {
      var _this = this;
      this.callback = callback;
      this.objects = _.flatten(objects);
      _(this.objects).each(function(transition) {
        return transition.group = _this;
      });
    }

    TransitionGroup.prototype.iterate = function() {
      return _(this.objects).each(function(transition) {
        return transition.iterate();
      });
    };

    TransitionGroup.prototype.remove = function(transition) {
      var _this = this;
      _(this.objects).each(function(item, index) {
        if (item === transition) {
          return _this.objects.splice(index, 1);
        }
      });
      if (this.objects.length === 0) {
        TransitionManager.remove(this);
        return this.callback();
      }
    };

    return TransitionGroup;

  })();

  TransitionManager = {
    transitions: [],
    isIdle: true,
    update: function() {
      return _(TransitionManager.transitions).each(function(transition) {
        if (transition != null) {
          return transition.iterate();
        }
      });
    },
    add: function(transition) {
      TransitionManager.transitions.push(transition);
      return TransitionManager.isIdle = false;
    },
    remove: function(transition) {
      var _this = this;
      _(TransitionManager.transitions).each(function(item, index) {
        if (item === transition) {
          return TransitionManager.transitions.splice(index, 1);
        }
      });
      if (TransitionManager.transitions.length === 0) {
        return TransitionManager.isIdle = true;
      }
    }
  };

  window.PushGenerator = (function() {

    PushGenerator.name = 'PushGenerator';

    function PushGenerator(parentNode, inputField, w, h, autorotate) {
      this.autorotate = autorotate != null ? autorotate : true;
      this.animate = __bind(this.animate, this);

      this.setupListeners = __bind(this.setupListeners, this);

      this.cubes = null;
      this.renderer = null;
      this.lights = [];
      this.cubeContainer = null;
      this.cubeController = null;
      this.parentNode = parentNode;
      this.inputField = inputField;
      this.init(w, h);
      this.renderer = new THREE.CanvasRenderer;
      this.renderer.setSize(w, h);
      $(this.parentNode).append(this.renderer.domElement);
      this.setupListeners();
      this.animate();
    }

    PushGenerator.prototype.init = function(w, h) {
      this.scene = new THREE.Scene;
      this.camera = new THREE.PerspectiveCamera(75, w / h, 1, 10000);
      this.camera.position.z = 1000;
      this.scene.add(this.camera);
      this.scene.add(new THREE.AmbientLight(0x999999));
      this.setupLights();
      this.cubeContainer = new THREE.Object3D;
      this.cubes = new CubeOfCubes(3, 150, 0);
      this.cubes.addToScene(this.cubeContainer);
      this.scene.add(this.cubeContainer);
      this.cubeController = new CubeController(this.cubes);
      return this.cubes.callback = this.cubeController.next;
    };

    PushGenerator.prototype.reset = function() {
      this.scene.remove(this.cubeContainer);
      this.cubeContainer = new THREE.Object3D;
      this.cubes = new CubeOfCubes(3, 150, 0);
      this.cubeController = new CubeController(this.cubes);
      this.cubes.addToScene(this.cubeContainer);
      this.scene.add(this.cubeContainer);
      return $(this.inputField).val('');
    };

    PushGenerator.prototype.setupLights = function() {
      this.lights[0] = new THREE.AmbientLight(0x333333);
      this.lights[1] = new THREE.PointLight(0xdddddd, 1, 500);
      this.lights[1].shadowCameraVisible = true;
      this.lights[1].position.z = 0;
      this.lights[1].position.x = -500;
      this.lights[1].position.y = 0;
      this.lights[2] = new THREE.PointLight(0xdddddd, 1, 500);
      this.lights[2].shadowCameraVisible = true;
      this.lights[2].position.z = 0;
      this.lights[2].position.x = 0;
      this.lights[2].position.y = 500;
      this.lights[3] = new THREE.PointLight(0xdddddd, 1, 500);
      this.lights[3].shadowCameraVisible = true;
      this.lights[3].position.z = 0;
      this.lights[3].position.x = 0;
      this.lights[3].position.y = -500;
      this.lights[4] = new THREE.PointLight(0xdddddd, 1, 500);
      this.lights[4].shadowCameraVisible = true;
      this.lights[4].position.z = 500;
      this.lights[4].position.x = 0;
      this.lights[4].position.y = 0;
      this.lights[5] = new THREE.PointLight(0xdddddd, 1, 500);
      this.lights[5].shadowCameraVisible = true;
      this.lights[5].position.z = 0;
      this.lights[5].position.x = 500;
      this.lights[5].position.y = 0;
      this.scene.add(this.lights[0]);
      this.scene.add(this.lights[1]);
      this.scene.add(this.lights[2]);
      this.scene.add(this.lights[3]);
      this.scene.add(this.lights[4]);
      return this.scene.add(this.lights[5]);
    };

    PushGenerator.prototype.setupListeners = function() {
      var _this = this;
      $(this.parentNode).on('mousemove', function(event) {
        if (_this.clicked) {
          _this.cubeContainer.rotation.y += (event.clientX - _this.refX) / 200;
          _this.cubeContainer.rotation.x += (event.clientY - _this.refY) / 200;
        }
        _this.refX = event.clientX;
        return _this.refY = event.clientY;
      });
      $(this.parentNode).on('mousedown', function(event) {
        return _this.clicked = true;
      });
      $(this.parentNode).on('mouseup', function(event) {
        _this.clicked = false;
        return $('#gen-input').focus();
      });
      $(this.inputField).on('keyup', function(event) {
        var rawUrl, text, url;
        if (event.keyCode === 8) {
          _this.reset();
        } else {
          _this.cubeController.setString($(event.target).attr('value'));
        }
        text = $(event.target).attr('value').split(' ').join('_');
        url = location.protocol + '//' + location.host + location.pathname + '?push=' + encodeURIComponent(text);
        rawUrl = location.protocol + '//' + location.host + location.pathname + '?push=' + text;
        window.history.replaceState(null, "push.generator: " + text, url);
        $('a.fb-share').attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + url);
        return $('a.tw-share').attr('href', 'https://twitter.com/share?text=I created something with the push.generator!');
      });
      $('a.fb-share').on('click', function(event) {
        event.preventDefault();
        return window.open($(this).attr('href'), "Share on Facebook", "width=640,height=320,scrollbars=no");
      });
      $('a.tw-share').on('click', function(event) {
        event.preventDefault();
        return window.open($(this).attr('href'), "Share on Twitter", "width=640,height=320,scrollbars=no");
      });
      return $('button#gen-share').on('click', function(event) {
        var img;
        return img = Canvas2Image.saveAsPNG($('canvas')[0], 800, 600);
      });
    };

    PushGenerator.prototype.animate = function() {
      if (!(this.clicked || !this.autorotate)) {
        this.cubeContainer.rotation.y += 0.001;
        this.cubeContainer.rotation.x += 0.0015;
      }
      requestAnimationFrame(this.animate);
      return this.render();
    };

    PushGenerator.prototype.render = function() {
      this.cubes.updatePositions();
      return this.renderer.render(this.scene, this.camera);
    };

    return PushGenerator;

  })();

  window.getURLVars = function() {
    var parts, vars;
    vars = {};
    parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
      return vars[key] = value;
    });
    return vars;
  };

}).call(this);
