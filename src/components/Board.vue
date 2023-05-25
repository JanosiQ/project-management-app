<template>
    <div class="board">
        <h2>{{ board.name }}</h2>
        <ul>
            <li v-for="(task, index) in board.tasks" :key="index">{{ task }}</li>
        </ul>
    </div>
</template>
  
<script>
export default {
    props: {
        board: {
            type: Object,
            required: true,
        },
    },
};
</script>
  
<style scoped>
.board {
    background-color: #f8f9fa;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 20px;
}

h2 {
    margin-top: 0;
    margin-bottom: 10px;
}

ul {
    padding-left: 20px;
}
</style>