
import { ethers, expect, loadFixture } from "./setup";

describe("TodoEngine", function () {

    async function deploy() {
        const [owner, addr1, addr2] = await ethers.getSigners();

        const TodoEngine = await ethers.getContractFactory("TodoEngine");
        const todo = await TodoEngine.deploy();
        await todo.waitForDeployment();

        return {
            todo, owner, addr1, addr2
        }
    }

    it("should add task", async () => {
        const { todo, owner, addr1, addr2 } = await loadFixture(deploy);

        expect(await todo.owner()).to.eq(await owner.getAddress());
        
        const title = "test title";
        const desc = "test desc";
        const deadline = BigInt(Date.now());

        //console.log(`deadline: ${deadline}`);

        const addTx = await todo.addTask(title, desc, deadline);
        addTx.wait();

        expect((await todo.tasks(0)).title).to.eq(title);
        expect((await todo.tasks(0)).description).to.eq(desc);
        expect((await todo.tasks(0)).completed).to.false;
        expect((await todo.tasks(0)).deadline).to.eq(deadline);
    });

    it("should change title", async () => {
        const { todo, owner, addr1, addr2 } = await loadFixture(deploy);

        const title = "test title";
        const desc = "test desc";
        const deadline = BigInt(Date.now());

        const addTx = await todo.addTask(title, desc, deadline);
        addTx.wait();

        expect((await todo.tasks(0)).title).to.eq(title);

        const newTitle = "new test title";

        const changeTitleTx = await todo.changeTaskTitle(newTitle, 0);
        changeTitleTx.wait();

        // console.log((await todo.tasks(0)).title)
        expect((await todo.tasks(0)).title).to.eq(newTitle);

        const todoNotAnOwner = todo.connect(addr1)

        const fakeTitle = "title for not owner"

        expect(todoNotAnOwner.changeTaskTitle(fakeTitle, 0)).to.be.revertedWithCustomError(todoNotAnOwner, "OwnableUnauthorizedAccount");

        expect((await todo.tasks(0)).title).to.not.eq(fakeTitle);
    });

    it("should change status", async () => {
        const { todo, owner, addr1, addr2 } = await loadFixture(deploy);

        const title = "test title";
        const desc = "test desc";
        const deadline = BigInt(Date.now());

        const addTx = await todo.addTask(title, desc, deadline);
        addTx.wait();

        //console.log((await todo.tasks(0)).completed);
        expect((await todo.tasks(0)).completed).to.false;

        const changeStatusTx = await todo.changeTaskStatus(0);
        changeStatusTx.wait();

        expect((await todo.tasks(0)).completed).to.true;

        const todoNotAnOwner = todo.connect(addr1);
        expect(todoNotAnOwner.changeTaskStatus(0)).to.be.revertedWithCustomError(todoNotAnOwner, "OwnableUnauthorizedAccount");

        expect((await todo.tasks(0)).completed).to.true;
    });

    it("should get task", async () => {
        const { todo, owner, addr1, addr2 } = await loadFixture(deploy);
        
        const title = "test title";
        const desc = "test desc";
        const deadline = BigInt(Date.now());

        const addTx = await todo.addTask(title, desc, deadline);
        addTx.wait();

        const task = await todo.getTask(0);
        
        expect(task[0]).to.eq(title);
        expect(task[1]).to.eq(desc);
        expect(task[2]).to.false;
        expect(task[3]).to.eq(deadline);

        const todoNotAnOwner = todo.connect(addr1);
        expect(todoNotAnOwner.getTask(0)).to.be.revertedWithCustomError(todoNotAnOwner, "OwnableUnauthorizedAccount");
    });
});
