(function (exports) {

    'use strict';

    exports.app = function (exports) {
        var Q = exports.Q,
            storage = exports.storage,
            filters = exports.filters,
            hasInit = false;

        function _filterRemaining(todos) {
            return todos.filter(function (todo) {
                return !todo.completed;
            });
        }

        function _calRemaining(todos) {
            return _filterRemaining(todos).length;
        }

        function _calCompleted(todos) {
            return todos.length - _calRemaining(todos);
        }

        function _isAllSelect(todos) {
            return !_calRemaining(todos);
        }

        return new Q({
            el: '#todoapp',
            data: {
                // { title: String, completed: Boolean }
                todos: storage.fetch(),
                newTodo: '',
                editedTodo: null,
                activeFilter: 'all',
                filters: {
                    all: function () {
                        return true;
                    },
                    active: function (todo) {
                        return !todo.completed;
                    },
                    completed: function (todo) {
                        return todo.completed;
                    }
                }
            },

            directives: {
                'todo-focus': function (value, options) {
                    if (!value) {
                        return;
                    }
                    var el = this.el;
                    setTimeout(function () {
                        el.focus();
                    }, 0);
                }
            },

            ready: function () {
                var self = this;
                this.$watch('todos', function () {
                    storage.save(self.todos.$get());
                }, true);
            },

            filters: {
                calRemaining: _calRemaining,
                calCompleted: _calCompleted,
                size: function (arr) {
                    return arr.length;
                },
                key: filters.key,
                pluralize: filters.pluralize,
                filterTodos: function (todos) {
                    return todos.filter(this.filters[this.activeFilter]);
                },
                checkActive: function (value, type) {
                    return value === type;
                },
                filterRemaining: _filterRemaining,
                isAllSelect: _isAllSelect
            },

            methods: {
                addTodo: function (e) {
                    if (!e.target.value) return;
                    this.todos.push({ title: e.target.value, completed: false });
                    e.target.value = '';
                },
                editTodo: function (obj) {
                    obj.$set('editing', true);
                },
                removeTodo: function (obj) {
                    var todos = this.todos, i = todos.indexOf(obj);
                    ~i && todos.splice(i, 1);
                },
                doneEdit: function (obj) {
                    obj.$set('editing', false);
                },
                toggleItem: function (obj) {
                    obj.$set('completed', !obj.completed);
                },
                toggleAll: function (obj) {
                    var completed = true,
                        todos = this.todos;
                    if (_isAllSelect(todos)) completed = false;
                    todos.forEach(function (todo) {
                        todo.completed !== completed &&
                            todo.$set('completed', completed);
                    });
                },
                removeCompleted: function () {
                    this.todos.forEach(function (todo) {
                        todo.completed !== false &&
                            todo.$set('completed', false);
                    });
                }
            }
        });
        hasInit = true;

    }(exports);

})(window);
