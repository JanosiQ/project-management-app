<template>
  <div class="task-view-container">
    <!-- Task details -->
    <TaskDetails :task="task" />

    <!-- Task lists -->
    <div class="task-lists-container">
      <div class="task-list" v-for="(list, index) in lists" :key="index">
        <div class="task-list-header">
          <h2>{{ list.name }}</h2>
          <button class="add-task-btn" @click="showAddTaskModal(list)">
            Add task
          </button>
        </div>
        <TaskList :list="list" :taskLists="lists" :task="task" :members="members" @editListName="editListName"
          @deleteList="deleteList" @showAddTaskModal="showAddTaskModal" @showEditTaskModal="showEditTaskModal"
          @showAddTaskListModal="showAddTaskListModal" />
      </div>
      <div class="task-list">
        <AddTaskList @addTaskList="addTaskList" />
      </div>
    </div>

    <!-- Add task modal -->
    <AddTaskModal :taskLists="lists" :members="members" :defaultTaskList="defaultTaskList" @addTask="addTask"
      ref="addTaskModal" />

    <!-- Edit task modal -->
    <EditTaskModal :taskLists="lists" :members="members" :task="selectedTask" @editTask="editTask" ref="editTaskModal" />

    <!-- Add task list modal -->
    <AddTaskListModal @addTaskList="addTaskList" ref="addTaskListModal" />

    <!-- Edit task list modal -->
    <EditTaskListModal :taskList="selectedList" @editListName="editListName" ref="editListModal" />

    <!-- Delete task list modal -->
    <DeleteTaskListModal :taskList="selectedList" @deleteList="deleteList" ref="deleteListModal" />

    <!-- Add member modal -->
    <AddMemberModal :members="members" @addMember="addMember" ref="addMemberModal" />

    <!-- Add attachment modal -->
    <AddAttachmentModal :task="task" @addAttachment="addAttachment" ref="addAttachmentModal" />

    <!-- Add comment modal -->
    <AddCommentModal :task="task" @addComment="addComment" ref="addCommentModal" />

    <!-- Task form modal -->
    <TaskFormModal :task="task" :members="members" :taskLists="lists" @editTask="editTask" ref="taskFormModal" />

  </div>
</template>

<script>
import TaskDetails from '@/components/TaskDetails.vue';
import TaskList from '@/components/TaskList.vue';
import AddTaskList from '@/components/AddTaskList.vue';
import AddTaskModal from '@/components/AddTaskModal.vue';
import EditTaskModal from '@/components/EditTaskModal.vue';
import AddTaskListModal from '@/components/AddTaskListModal.vue';
//import EditTaskListModal from '@/components/EditTaskListModal.vue';
//import DeleteTaskListModal from '@/components/DeleteTaskListModal.vue';
//import AddMemberModal from '@/components/AddMemberModal.vue';
//import AddAttachmentModal from '@/components/AddAttachmentModal.vue';
import AddCommentModal from '@/components/AddCommentModal.vue';
//import TaskFormModal from '@/components/TaskFormModal.vue';

export default {
  components: {
    TaskDetails,
    TaskList,
    AddTaskList,
    AddTaskModal,
    EditTaskModal,
    AddTaskListModal,
    // EditTaskListModal,
    // DeleteTaskListModal,
    // AddMemberModal,
    // AddAttachmentModal,
    AddCommentModal,
    //TaskFormModal
  },
  data() {
    return {
      task: {
        id: 1,
        name: 'Task 1',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        assignee: {
          name: 'John Doe',
          avatar: 'https://i.pravatar.cc/50?u=1'
        },
        dueDate: '2023-03-31',
        attachments: [
          {
            id: 1,
            name: 'Attachment 1',
            url: 'https://picsum.photos/200/300'
          },
          {
            id: 2,
            name: 'Attachment 2',
            url: 'https://picsum.photos/200/300'
          }
        ],
        comments: [
          {
            id: 1,
            author: {
              name: 'Jane Doe',
              avatar: 'https://i.pravatar.cc/50?u=2'
            },
            text: 'This is a comment'
          },
          {
            id: 2,
            author: {
              name: 'John Smith',
              avatar: 'https://i.pravatar.cc/50?u=3'
            },
            text: 'This is another comment'
          }
        ],
        members: [
          {
            name: 'John Doe',
            avatar: 'https://i.pravatar.cc/50?u=1'
          },
          {
            name: 'Jane Doe',
            avatar: 'https://i.pravatar.cc/50?u=2'
          }
        ]
      },
      lists: [
        {
          id: 1,
          name: 'To do',
          tasks: [
            {
              id: 1,
              name: 'Task 1',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              assignee: {
                name: 'John Doe',
                avatar: 'https://i.pravatar.cc/50?u=1'
              },
              dueDate: '2023-03-31',
              attachments: [
                {
                  id: 1,
                  name: 'Attachment 1',
                  url: 'https://picsum.photos/200/300'
                }
              ],
              comments: [
                {
                  id: 1,
                  author: {
                    name: 'Jane Doe',
                    avatar: 'https://i.pravatar.cc/50?u=2'
                  },
                  text: 'This is a comment'
                },
                {
                  id: 2,
                  author: {
                    name: 'John Smith',
                    avatar: 'https://i.pravatar.cc/50?u=3'
                  },
                  text: 'This is another comment'
                }
              ],
              members: [
                {
                  name: 'John Doe',
                  avatar: 'https://i.pravatar.cc/50?u=1'
                }
              ]
            },
            {
              id: 2,
              name: 'Task 2',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
              assignee: {
                name: 'Jane Doe',
                avatar: 'https://i.pravatar.cc/50?u=2'
              },
              dueDate: '2023-04-15',
              attachments: [],
              comments: [],
              members: [],
              name: 'Jane Doe',
              avatar: 'https://i.pravatar.cc/50?u=2'
            },
            {
              name: 'John Smith',
              avatar: 'https://i.pravatar.cc/50?u=3'
            }
          ]
        }
      ]
    }
  }
}
</script>