import { Application, Graphics, Ticker } from "pixi.js";

class CubePhysics {
  private canvas = document.querySelector(".app");
  private app = new Application();
  private ticker = new Ticker();
  private cubes?: any[];
  private move = false;
  private selectedCube?: Graphics;
  private cubeGravityMap = new Map<Graphics, boolean>(); 
  private offsetX = 0;  
  private offsetY = 0;

  async init() {
    await this.app.init({
      width: 1000,
      height: 600,
      background: "aqua",
      backgroundAlpha: 1,
    });
    (globalThis as any).__PIXI_APP__ = this.app;
    if (this.canvas) {
      this.canvas?.appendChild(this.app.canvas);
    }

    this.cubes = [];

    for (let i = 0; i < 6; i++) {
      const cube = new Graphics()
        .roundRect(i * 120, 0, 100, 40, 20)
        .fill({ color: "red" });
      cube.label = `name${i}`;
      this.app.stage.addChild(cube);
      this.cubes.push(cube);

      this.cubeGravityMap.set(cube, true); 

      cube.eventMode = "dynamic";
      cube.cursor = "pointer";

      cube.addEventListener("mousedown", (e: any) => {
        this.move = true;
        this.selectedCube = cube;
        this.cubeGravityMap.set(cube, false); 

        this.offsetX = e.data.global.x - cube.x;
        this.offsetY = e.data.global.y - cube.y;
      });
    }

    window.addEventListener("mouseup", () => {
      if (this.selectedCube) {
        this.cubeGravityMap.set(this.selectedCube, true); 
      }
      this.move = false;
      this.selectedCube = undefined;
    });

    window.addEventListener("mousemove", (e) => {
      if (this.move && this.selectedCube) {
        const x = e.clientX - this.offsetX;
        const y = e.clientY - this.offsetY;
        this.cordinate(this.selectedCube, x, y);
      }
    });

    this.ticker.start();
    this.ticker.add(() => {
      this.cubes?.forEach((cube) => {
        if (this.cubeGravityMap.get(cube)) {
          this.gravityAnimate(cube); 
        }
      });
    });
  }

  private gravityAnimate(cube: any) {
    cube.y += 5;
    if (cube.y >= 500) {
      cube.y = 500;
    }
  }

  cordinate(cube: any, x: any, y: any) {
    cube.x = x;
    cube.y = y;
    console.log(cube.x, cube.y);
  }
}

const physics = new CubePhysics();
physics.init();
