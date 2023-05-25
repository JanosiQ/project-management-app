<template>
    <form class="new-board-form" @submit.prevent="createBoard">
        <h2>Create a new board</h2>
        <div>
            <label for="board-name">Name:</label>
            <input type="text" id="board-name" v-model="name" required />
        </div>
        <button type="submit">Create</button>
    </form>
</template>
<script>
export default {
    data() {
        return {
            name: "",
        };
    },
    methods: {
        createBoard() {
            this.$store.commit("createBoard", { name: this.name });
            this.name = "";
        },
    },
};
</script>
<style scoped>
h2 {
    margin-top: 0;
}

label {
    display: block;
    margin-bottom: 5px;
}

input[type="text"] {
    width: 100%;
    padding: 5px;
    border: 1px solid #ced4da;
    border-radius: 3px;
}

button[type="submit"] {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
}

button[type="submit"]:hover {
    background-color: #0069d9;
}
</style>