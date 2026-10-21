import { _decorator, Component, find, Vec2 } from 'cc';
import { EnemyInputSystem } from './EnemyInputSystem';
import { EnemyMovementSystem } from './EnemyMovementSystem';
import { HealthSystem } from './HealthSystem';
import { createDefaultEnemyConfig } from './EnemyConfig';
import type { EnemyConfig } from './EnemyConfig';

const { ccclass } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {
    public static activeEnemies: Enemy[] = [];

    private inputSystem: EnemyInputSystem | null = null;
    private movementSystem: EnemyMovementSystem | null = null;
    private healthSystem: HealthSystem | null = null;
    private initialized: boolean = false;

    protected onLoad(): void {
        Enemy.activeEnemies.push(this);
    }

    public init(enemyConfig: EnemyConfig): void {
        this.inputSystem = this.getComponent(EnemyInputSystem);
        this.movementSystem = this.getComponent(EnemyMovementSystem);
        this.healthSystem = this.getComponent(HealthSystem);

        this.node.setScale(enemyConfig.scale.x, enemyConfig.scale.y, this.node.scale.z);
        if (this.healthSystem) this.healthSystem.initialize(enemyConfig.health);

        // Include enemies placed outside EnemyLayer in the same waypoint setup.
        const wanderNodes = this.node.parent?.getChildByName('WanderNodes')
            ?? find('Canvas/EnemyLayer/WanderNodes');
        const wanderPoints = wanderNodes
            ? wanderNodes.children.map(child => new Vec2(
                child.worldPosition.x,
                child.worldPosition.y,
            ))
            : [];

        if (this.inputSystem) {
            this.inputSystem.initialize(find('Canvas/Player'), wanderPoints, enemyConfig.intent);
        }
        if (this.movementSystem) {
            this.movementSystem.init(enemyConfig.intent.maxSpeed, enemyConfig.moving);
        }
        this.initialized = true;
    }

    protected start(): void {
        if (!this.initialized) {
            const config = createDefaultEnemyConfig();
            config.scale.set(this.node.scale.x, this.node.scale.y);
            this.init(config);
        }
    }

    protected update(deltaTime: number): void {
        if (this.healthSystem && this.healthSystem.isDead) {
            // Remove the physics body outside the contact callback.
            this.node.destroy();
            return;
        }
        if (this.inputSystem && this.movementSystem) {
            this.inputSystem.isMovingSlowly = this.movementSystem.isMovingSlowly();
            this.inputSystem.processFSM(deltaTime);
            this.movementSystem.updateMovement(this.inputSystem.getMoveDirection());
            this.movementSystem.updateRotation(this.inputSystem.getRotationAngle());
        }
        if (this.inputSystem?.stateDebugLabel) {
            this.inputSystem.stateDebugLabel.node.angle = -this.node.angle;
        }
    }

    protected onDestroy(): void {
        const index = Enemy.activeEnemies.indexOf(this);
        if (index > -1) Enemy.activeEnemies.splice(index, 1);
    }
}

