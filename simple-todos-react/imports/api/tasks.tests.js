/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import { Accounts} from 'meteor/accounts-base';

import { Tasks } from './tasks.js';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      let userId = Random.id();
      let taskId;

      before(()=>{

          let user=Meteor.users.findOne( {username : "test"});

          if(!user){
              userId=Accounts.createUser({
                  "username":"test",
                  "email":"a@b.c",
                  "password":"122334"
              })
          }else {
              userId= user._id
          }

      });


        beforeEach(() => {
            Tasks.remove({});
            taskId = Tasks.insert({
                text: 'test task',
                createdAt: new Date(),
                owner: userId,
                username: 'tmeasday',
            });
        });

      it('can delete owned task', () => {

        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        let invocation = { userId };
        deleteTask.apply(invocation, [taskId]);
        assert.equal(Tasks.find().count(), 0);
      });



        it('can insert new task', () => {

            const insertTask = Meteor.server.method_handlers['tasks.insert'];
            let invocation = { userId };
            insertTask.apply(invocation, ['testing']);
            assert.equal(Tasks.find().count(), 2);
        });



        it('cannot insert task if not logged in', () => {

            const insertTask = Meteor.server.method_handlers['tasks.insert'];
            let invocation =  Random.id() ;

            assert.throws(function(){
                insertTask.apply(invocation, ['testing']);
                }, Meteor.Error,'[not-authorized]'

            );
            assert.equal(Tasks.find().count(), 1);
        });


        it('cannot delete someone else task', () => {

            const deleteTask = Meteor.server.method_handlers['tasks.remove'];



            let invocation = Random.id();


                deleteTask.apply(invocation, [taskId]);


            assert.equal(Tasks.find().count(), 1);
        });


        it('can set own task checked', () => {

             const setChecked = Meteor.server.method_handlers['tasks.setChecked'];

            const invocation = { userId };
            setChecked.apply(invocation, [taskId,true]);
            assert.equal(Tasks.findOne(taskId).checked, true);
        });


        it('cannot set someone else task checked', () => {

            const setChecked = Meteor.server.method_handlers['tasks.setChecked'];
            const markPrivate = Meteor.server.method_handlers['tasks.setPrivate'];

            const invocation = { userId };

            markPrivate.apply(invocation,[taskId,true]);

            assert.throws(function(){
                setChecked.apply(Random.id(), [taskId,true]);
                }, Meteor.Error,'[not-authorized]'
            );
            assert.equal(Tasks.find().count(), 1);
        });


        it('Can set own task private', () => {

            const markPrivate = Meteor.server.method_handlers['tasks.setPrivate'];

            const invocation = { userId };

            markPrivate.apply(invocation,[taskId,true]);

            assert.equal(Tasks.findOne(taskId).private, true);
        });


        it('cannot set someone else task private', () => {

            const markPrivate = Meteor.server.method_handlers['tasks.setPrivate'];

            assert.throws(function(){
                    markPrivate.apply(Random.id(),[taskId,true]);
                }, Meteor.Error,'[not-authorized]'
            );

            assert.equal(Tasks.find().count(), 1);
        });






    });
  });
}
