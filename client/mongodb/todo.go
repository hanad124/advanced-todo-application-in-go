package mongodb

import (
	"context"

	"github.com/yourusername/advanced-todo-using-go/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type TodoRepository struct {
	collection *mongo.Collection
}

func NewTodoRepository(db *mongo.Database) *TodoRepository {
	return &TodoRepository{
		collection: db.Collection("todos"),
	}
}

func (r *TodoRepository) GetAll(ctx context.Context) ([]models.Todo, error) {
	var todos []models.Todo
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &todos); err != nil {
		return nil, err
	}
	return todos, nil
}

func (r *TodoRepository) GetByID(ctx context.Context, id string) (*models.Todo, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var todo models.Todo
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&todo)
	if err != nil {
		return nil, err
	}
	return &todo, nil
}

func (r *TodoRepository) Create(ctx context.Context, todo *models.Todo) error {
	result, err := r.collection.InsertOne(ctx, todo)
	if err != nil {
		return err
	}
	todo.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *TodoRepository) Update(ctx context.Context, id string, todo *models.Todo) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	update := bson.M{
		"$set": bson.M{
			"title":       todo.Title,
			"description": todo.Description,
			"completed":   todo.Completed,
			"updated_at":  todo.UpdatedAt,
		},
	}

	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	return err
}

func (r *TodoRepository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}
