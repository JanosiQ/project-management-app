<template>
    <div class="delete-board-modal" v-if="show">
        <div class="delete-board-modal__content">
            <h2>Are you sure you want to delete this board?</h2>
            <div>
                <button @click="cancel">Cancel</button>
                <button @click="deleteBoard" class="delete-board-modal__delete-button">Delete</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            required: true,
        },
        boardIndex: {
            type: Number,
            required: true,
        },
    },
    methods: {
        cancel() {
            this.$emit("close");
        },
        deleteBoard() {
            this.$emit("delete");
        },
    },
};
</script>
<style scoped>
.delete-board-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.delete-board-modal__content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.delete-board-modal__delete-button {
    background-color: #dc3545;
    border: none;
    color: white;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    margin-left: 10px;
}

.delete-board-modal__delete-button:hover {
    background-color: #c82333;
}

button {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
}

button:hover {
    background-color: #0069d9;
}
</style>
  